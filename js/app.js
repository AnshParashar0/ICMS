/* ============================================
   ICMS - Infrastructure Complaint Management System
   Main JavaScript Application
   ============================================ */

// Import backend API
import { authAPI, complaintsAPI, apiUtils } from './backend-api.js';

// Global Variables
let currentUser = null;
let complaints = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load any stored user profile from localStorage
    loadUserProfile();

    // Initialize page-specific functionality
    initializePage();
});

// Load user profile from backend
async function loadUserProfile() {
    try {
        // For now, we'll get the user info from localStorage
        // In a real app, you'd decode the JWT token or call a profile endpoint
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
        authAPI.logout();
    }
}

// Page-specific initialization
function initializePage() {
    // Support both `/page` and `/page.html` URLs
    const lastSegment = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = lastSegment.includes('.') ? lastSegment : `${lastSegment}.html`;
    
    switch (currentPage) {
        case 'index.html':
            initializeLoginPage();
            break;
        case 'register.html':
            initializeRegisterPage();
            break;
        case 'student-dashboard.html':
            initializeStudentDashboard();
            break;
        case 'admin-dashboard.html':
            initializeAdminDashboard();
            break;
        case 'raise-complaint.html':
            initializeRaiseComplaintPage();
            break;
    }
}

// ============================================
// LOGIN PAGE FUNCTIONALITY
// ============================================
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Simple validation
    if (email && password && userType) {
        // Show loading state
        apiUtils.showLoading();
        
        try {
            // Call backend API
            const response = await authAPI.login({ email, password });
            
            // Store user info
            currentUser = {
                email: response.user.email,
                name: response.user.name,
                type: response.user.role.toLowerCase()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect based on user type
            if (currentUser.type === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        } catch (error) {
            errorMessage.classList.remove('d-none');
            errorMessage.textContent = apiUtils.handleError(error, 'Login failed');
            setTimeout(() => {
                errorMessage.classList.add('d-none');
            }, 5000);
        } finally {
            apiUtils.hideLoading();
        }
    } else {
        errorMessage.classList.remove('d-none');
        errorMessage.textContent = 'Please fill in all fields';
        setTimeout(() => {
            errorMessage.classList.add('d-none');
        }, 5000);
    }
}

// ============================================
// REGISTER PAGE FUNCTIONALITY
// ============================================
function initializeRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const errorText = document.getElementById('errorText');
    
    // Reset messages
    errorMessage.classList.add('d-none');
    successMessage.classList.add('d-none');
    
    // Validation
    if (password.length < 6) {
        errorText.textContent = 'Password must be at least 6 characters long';
        errorMessage.classList.remove('d-none');
        return;
    }
    
    if (password !== confirmPassword) {
        errorText.textContent = 'Passwords do not match';
        errorMessage.classList.remove('d-none');
        return;
    }
    
    // Show loading state
    apiUtils.showLoading();
    
    try {
        // Call backend API to register user
        await authAPI.register({
            name: fullName,
            email: email,
            password: password,
            contactNumber: ''
        });
        
        // Automatically log the user in after successful registration
        const loginResponse = await authAPI.login({ email, password });
        
        currentUser = {
            email: loginResponse.user.email,
            name: loginResponse.user.name,
            type: loginResponse.user.role.toLowerCase()
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        apiUtils.hideLoading();
        successMessage.classList.remove('d-none');
        
        // Redirect directly into the app based on role
        if (currentUser.type === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    } catch (error) {
        apiUtils.hideLoading();
        errorText.textContent = apiUtils.handleError(error, 'Registration failed');
        errorMessage.classList.remove('d-none');
    }
}

// ============================================
// STUDENT DASHBOARD FUNCTIONALITY
// ============================================
function initializeStudentDashboard() {
    if (!currentUser || currentUser.type !== 'student') {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user name in UI
    document.getElementById('studentName').textContent = currentUser.name;
    document.getElementById('welcomeName').textContent = currentUser.name;
    
    // Load complaints
    loadStudentComplaints();
    updateStudentStatistics();
}

async function loadStudentComplaints() {
    try {
        const userComplaints = await complaintsAPI.getMyComplaints();
        const tableBody = document.getElementById('complaintsTableBody');
        const noComplaintsMessage = document.getElementById('noComplaintsMessage');
        
        if (userComplaints.length === 0) {
            tableBody.innerHTML = '';
            noComplaintsMessage.classList.remove('d-none');
            return;
        }
        
        noComplaintsMessage.classList.add('d-none');
        tableBody.innerHTML = userComplaints.map(complaint => `
            <tr class="fade-in">
                <td><strong>${complaint.complaintId}</strong></td>
                <td>${complaint.category}</td>
                <td>${complaint.location}</td>
                <td>${apiUtils.getStatusBadge(complaint.status)}</td>
                <td>${apiUtils.formatDate(complaint.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewComplaintDetails('${complaint.id}')">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        apiUtils.handleError(error, 'Failed to load complaints');
    }
}

async function updateStudentStatistics() {
    try {
        // For now, we'll calculate from loaded complaints
        // In a real app, you might have a dedicated statistics endpoint
        const userComplaints = await complaintsAPI.getMyComplaints();
        
        document.getElementById('totalComplaints').textContent = userComplaints.length;
        document.getElementById('pendingComplaints').textContent = 
            userComplaints.filter(c => c.status === 'PENDING').length;
        document.getElementById('resolvedComplaints').textContent = 
            userComplaints.filter(c => c.status === 'RESOLVED').length;
    } catch (error) {
        apiUtils.handleError(error, 'Failed to load statistics');
    }
}

// ============================================
// ADMIN DASHBOARD FUNCTIONALITY
// ============================================
function initializeAdminDashboard() {
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    // Load dashboard data
    loadAdminDashboard();
    loadRecentComplaints();
}

async function loadAdminDashboard() {
    try {
        const statistics = await complaintsAPI.getStatistics();
        document.getElementById('adminTotalComplaints').textContent = statistics.total;
        document.getElementById('adminPendingComplaints').textContent = statistics.pending;
        document.getElementById('adminInProgressComplaints').textContent = statistics.inProgress;
        document.getElementById('adminResolvedComplaints').textContent = statistics.resolved;
    } catch (error) {
        apiUtils.handleError(error, 'Failed to load dashboard statistics');
    }
}

async function loadRecentComplaints() {
    try {
        const recentComplaints = await complaintsAPI.getRecentComplaints();
        const tableBody = document.getElementById('recentComplaintsTableBody');
        
        tableBody.innerHTML = recentComplaints.map(complaint => `
            <tr class="fade-in">
                <td><strong>${complaint.complaintId}</strong></td>
                <td>${complaint.studentName}</td>
                <td>${complaint.category}</td>
                <td>${complaint.location}</td>
                <td>${apiUtils.getStatusBadge(complaint.status)}</td>
                <td>${apiUtils.formatDate(complaint.createdAt)}</td>
            </tr>
        `).join('');
    } catch (error) {
        apiUtils.handleError(error, 'Failed to load recent complaints');
    }
}

function showDashboard() {
    document.getElementById('dashboardContent').classList.remove('d-none');
    document.getElementById('complaintsContent').classList.add('d-none');
    document.getElementById('pageTitle').textContent = 'Dashboard';
    
    // Update active nav
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showComplaints() {
    document.getElementById('dashboardContent').classList.add('d-none');
    document.getElementById('complaintsContent').classList.remove('d-none');
    document.getElementById('pageTitle').textContent = 'Complaints Management';
    
    // Update active nav
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load all complaints
    loadAllComplaints();
}

async function loadAllComplaints() {
    try {
        const allComplaints = await complaintsAPI.getAllComplaints();
        const tableBody = document.getElementById('allComplaintsTableBody');
        
        tableBody.innerHTML = allComplaints.map(complaint => `
            <tr class="fade-in">
                <td><strong>${complaint.complaintId}</strong></td>
                <td>${complaint.studentName}</td>
                <td>${complaint.category}</td>
                <td>${complaint.location}</td>
                <td>${apiUtils.getStatusBadge(complaint.status)}</td>
                <td>${apiUtils.formatDate(complaint.createdAt)}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editComplaintStatus('${complaint.id}')">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        ${complaint.status !== 'RESOLVED' ? `
                            <button class="btn btn-sm btn-success" onclick="resolveComplaint('${complaint.id}')">
                                <i class="bi bi-check"></i> Resolve
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        apiUtils.handleError(error, 'Failed to load complaints');
    }
}

async function filterComplaints() {
    try {
        const status = document.getElementById('statusFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        let filteredComplaints = await complaintsAPI.filterComplaints(
            status || null, 
            searchTerm || null
        );
        
        const tableBody = document.getElementById('allComplaintsTableBody');
        
        if (filteredComplaints.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        <i class="bi bi-search"></i> No complaints found matching your criteria
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = filteredComplaints.map(complaint => `
            <tr class="fade-in">
                <td><strong>${complaint.complaintId}</strong></td>
                <td>${complaint.studentName}</td>
                <td>${complaint.category}</td>
                <td>${complaint.location}</td>
                <td>${apiUtils.getStatusBadge(complaint.status)}</td>
                <td>${apiUtils.formatDate(complaint.createdAt)}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editComplaintStatus('${complaint.id}')">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        ${complaint.status !== 'RESOLVED' ? `
                            <button class="btn btn-sm btn-success" onclick="resolveComplaint('${complaint.id}')">
                                <i class="bi bi-check"></i> Resolve
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        apiUtils.handleError(error, 'Failed to filter complaints');
    }
}

function searchComplaints() {
    filterComplaints();
}

function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('searchInput').value = '';
    loadAllComplaints();
}

async function editComplaintStatus(complaintId) {
    try {
        const complaint = await complaintsAPI.getComplaintById(complaintId);
        if (!complaint) return;
        
        document.getElementById('complaintId').value = complaintId;
        document.getElementById('newStatus').value = complaint.status;
        
        const modal = new bootstrap.Modal(document.getElementById('statusModal'));
        modal.show();
    } catch (error) {
        apiUtils.handleError(error, 'Failed to load complaint details');
    }
}

async function updateComplaintStatus() {
    try {
        const complaintId = document.getElementById('complaintId').value;
        const newStatus = document.getElementById('newStatus').value;
        
        await complaintsAPI.updateComplaintStatus(complaintId, newStatus);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('statusModal'));
        modal.hide();
        
        // Show success message
        showSuccessMessage('Complaint status updated successfully!');
        
        // Reload data
        loadAllComplaints();
        loadAdminDashboard();
    } catch (error) {
        apiUtils.handleError(error, 'Failed to update complaint status');
    }
}

async function resolveComplaint(complaintId) {
    if (confirm('Are you sure you want to mark this complaint as resolved?')) {
        try {
            await complaintsAPI.updateComplaintStatus(complaintId, 'RESOLVED');
            
            showSuccessMessage('Complaint marked as resolved!');
            loadAllComplaints();
            loadAdminDashboard();
        } catch (error) {
            apiUtils.handleError(error, 'Failed to resolve complaint');
        }
    }
}

async function refreshData() {
    try {
        await loadAdminDashboard();
        await loadRecentComplaints();
        
        if (!document.getElementById('complaintsContent').classList.contains('d-none')) {
            await loadAllComplaints();
        }
        
        showSuccessMessage('Data refreshed successfully!');
    } catch (error) {
        apiUtils.handleError(error, 'Failed to refresh data');
    }
}

// ============================================
// RAISE COMPLAINT PAGE FUNCTIONALITY
// ============================================
function initializeRaiseComplaintPage() {
    if (!currentUser || currentUser.type !== 'student') {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user name in UI
    document.getElementById('studentName').textContent = currentUser.name;
    
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
        complaintForm.addEventListener('submit', handleRaiseComplaint);
    }
}

async function handleRaiseComplaint(e) {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const contactNumber = document.getElementById('contactNumber').value;
    
    // Show loading state
    apiUtils.showLoading();
    
    try {
        // Call backend API
        const newComplaint = await complaintsAPI.createComplaint({
            category: category,
            location: location,
            description: description,
            priority: priority,
            contactNumber: contactNumber
        });
        
        apiUtils.hideLoading();
        
        // Show success modal
        document.getElementById('complaintIdDisplay').textContent = newComplaint.complaintId;
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
        
        // Reset form
        document.getElementById('complaintForm').reset();
    } catch (error) {
        apiUtils.hideLoading();
        apiUtils.handleError(error, 'Failed to submit complaint');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="status-badge status-pending"><i class="bi bi-clock"></i> Pending</span>',
        'in-progress': '<span class="status-badge status-in-progress"><i class="bi bi-arrow-repeat"></i> In Progress</span>',
        'resolved': '<span class="status-badge status-resolved"><i class="bi bi-check-circle"></i> Resolved</span>'
    };
    return badges[status] || badges['pending'];
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('d-none');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('d-none');
    }
}

function showSuccessMessage(message) {
    const modal = document.getElementById('successModal');
    const messageText = document.getElementById('successMessageText');
    
    if (modal && messageText) {
        messageText.textContent = message;
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            bsModal.hide();
        }, 3000);
    }
}

function viewComplaintDetails(complaintId) {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;
    
    // Create a detailed view (you could create a modal for this)
    alert(`Complaint Details:\n\nID: ${complaint.id}\nCategory: ${complaint.category}\nLocation: ${complaint.location}\nDescription: ${complaint.description}\nPriority: ${complaint.priority}\nStatus: ${complaint.status}\nDate: ${formatDate(complaint.date)}`);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authAPI.logout();
        currentUser = null;
        window.location.href = 'index.html';
    }
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
    // You could send this to a logging service in a real application
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to a logging service in a real application
});

// ============================================
// UTILITY: Export functions for HTML onclick handlers
// ============================================
window.showDashboard = showDashboard;
window.showComplaints = showComplaints;
window.filterComplaints = filterComplaints;
window.searchComplaints = searchComplaints;
window.clearFilters = clearFilters;
window.editComplaintStatus = editComplaintStatus;
window.updateComplaintStatus = updateComplaintStatus;
window.resolveComplaint = resolveComplaint;
window.refreshData = refreshData;
window.viewComplaintDetails = viewComplaintDetails;
window.logout = logout;
