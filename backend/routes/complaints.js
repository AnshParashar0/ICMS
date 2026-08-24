const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../config/cloudinary');
const { sendStatusUpdateEmail } = require('../utils/email');

// ── POST /api/complaints — Create complaint (multipart/form-data) ────
// Matches Java: ComplaintController.createComplaint()
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { category, location, description, priority, contactNumber } = req.body;

        // Get user from JWT email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload image to Cloudinary (handled by multer-storage-cloudinary)
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path; // Cloudinary URL from multer-storage-cloudinary
        }

        const complaint = new Complaint({
            complaint_id: 'CMP' + Date.now(),
            user_id: user._id,
            student_name: user.name,
            category,
            location,
            description,
            priority: priority || 'MEDIUM',
            status: 'PENDING',
            contact_number: contactNumber || user.contact_number,
            imagePath
        });

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── GET /api/complaints — Get all complaints (ADMIN only) ────────────
// Matches Java: ComplaintController.getAllComplaints() + @PreAuthorize("hasRole('ADMIN')")
router.get('/', auth, admin, async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user_id', 'name email').sort({ created_at: -1 });

        // Set studentName from populated user (matches Java postLoad behavior)
        const result = complaints.map(c => {
            const obj = c.toObject();
            if (obj.user_id && obj.user_id.name) {
                obj.student_name = obj.user_id.name;
            }
            return obj;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── GET /api/complaints/my — Get current user's complaints ───────────
// Matches Java: ComplaintController.myComplaints()
router.get('/my', auth, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const complaints = await Complaint.find({ user_id: user._id })
            .populate('user_id', 'name email')
            .sort({ created_at: -1 });

        const result = complaints.map(c => {
            const obj = c.toObject();
            if (obj.user_id && obj.user_id.name) {
                obj.student_name = obj.user_id.name;
            }
            return obj;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── PUT /api/complaints/:id/status — Update complaint status (ADMIN) ─
// Matches Java: ComplaintController.updateStatus()
router.put('/:id/status', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.query.status || req.body.status;

        if (!status || !['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const complaint = await Complaint.findById(id).populate('user_id', 'name email');
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        await complaint.save();

        // Send status update email (matches Java ComplaintService)
        if (complaint.user_id && complaint.user_id.email) {
            await sendStatusUpdateEmail(
                complaint.user_id.email,
                complaint.complaint_id,
                status
            );
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── DELETE /api/complaints/:id — Delete complaint (ADMIN) ────────────
// Matches Java: ComplaintController.deleteComplaint()
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        await Complaint.findByIdAndDelete(id);
        res.json({ message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
