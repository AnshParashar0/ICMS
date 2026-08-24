require('dotenv').config();

// ── Get fresh access token using refresh token (direct REST, no googleapis lib) ─
async function getAccessToken() {
    const params = new URLSearchParams({
        client_id: process.env.GMAIL_CLIENT_ID,
        client_secret: process.env.GMAIL_CLIENT_SECRET,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        grant_type: 'refresh_token'
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(`OAuth2 token error: ${data.error} - ${data.error_description || ''}`);
    }
    if (!data.access_token) {
        throw new Error('No access token received from Google');
    }
    console.log('Got fresh Gmail access token');
    return data.access_token;
}


// ── Send email via Gmail API (matches Java EmailService) ──────────────
async function sendEmail(toEmail, subject, body) {
    try {
        const accessToken = await getAccessToken();

        // Build RFC 2822 email format
        const emailContent =
            `From: ${process.env.GMAIL_FROM_EMAIL}\r\n` +
            `To: ${toEmail}\r\n` +
            `Subject: ${subject}\r\n` +
            `Content-Type: text/plain; charset=utf-8\r\n` +
            `\r\n` +
            body;

        // Base64url encode
        const encodedEmail = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // Call Gmail API
        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ raw: encodedEmail })
        });

        if (response.ok) {
            console.log(`Email sent successfully to: ${toEmail}`);
        } else {
            const errorBody = await response.text();
            console.error('Email sending failed:', errorBody);
        }
    } catch (error) {
        console.error('Email sending failed (non-critical):', error.message);
    }
}

// ── Public methods (match Java EmailService) ──────────────────────────

function sendOtpEmail(toEmail, name, otp) {
    if (!toEmail || !toEmail.includes('@') || toEmail.endsWith('@test.com')) {
        console.log('Skipping OTP email for:', toEmail);
        return;
    }

    const body =
`Dear ${name},

Thank you for registering with ICMS - Infrastructure Complaint Management System!

Your Email Verification OTP is:

==============================
        ${otp}
==============================

This OTP is valid for 10 minutes. Do not share it with anyone.

If you did not request this, please ignore this email.

Regards,
ICMS Team`;

    return sendEmail(toEmail, 'ICMS - Your Email Verification OTP', body);
}

function sendWelcomeEmail(toEmail, name) {
    if (!toEmail || !toEmail.includes('@') || toEmail.endsWith('@test.com')) {
        console.log('Skipping welcome email for:', toEmail);
        return;
    }

    const body =
`Dear ${name},

Welcome to ICMS - Infrastructure Complaint Management System!

Your account has been created successfully. You can now:
- Submit infrastructure complaints
- Track the status of your complaints
- Get notified when your complaint is updated

Login at: https://icms-1.onrender.com

Regards,
ICMS Team`;

    return sendEmail(toEmail, 'Welcome to ICMS - Infrastructure Complaint Management System', body);
}

function sendStatusUpdateEmail(toEmail, complaintId, newStatus) {
    if (!toEmail || !toEmail.includes('@') || toEmail.endsWith('@test.com')) {
        console.log('Skipping status email for:', toEmail);
        return;
    }

    const statusTextMap = {
        'IN_PROGRESS': 'In Progress - Our team is working on it',
        'RESOLVED': 'Resolved - Your complaint has been resolved',
        'PENDING': 'Pending - Your complaint is awaiting review'
    };
    const statusText = statusTextMap[newStatus] || 'Pending - Your complaint is awaiting review';

    const body =
`Dear Student,

Your complaint status has been updated.

Complaint ID: ${complaintId}
New Status: ${statusText}

You can login to ICMS to view more details.

Regards,
ICMS Team`;

    return sendEmail(toEmail, `ICMS - Complaint Status Updated: ${complaintId}`, body);
}

module.exports = {
    sendOtpEmail,
    sendWelcomeEmail,
    sendStatusUpdateEmail
};
