const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaint_id: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student_name: {
        type: String,
        required: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        maxlength: 50
    },
    location: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'],
        default: 'PENDING',
        required: true
    },
    contact_number: {
        type: String,
        maxlength: 20
    },
    imagePath: {
        type: String,
        default: null
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
