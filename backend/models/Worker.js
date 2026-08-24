const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BUSY', 'OFF_DUTY'],
        default: 'AVAILABLE'
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: false }
});

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;
