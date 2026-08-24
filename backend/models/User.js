const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        maxlength: 255
    },
    role: {
        type: String,
        enum: ['STUDENT', 'ADMIN'],
        default: 'STUDENT',
        required: true
    },
    contact_number: {
        type: String,
        maxlength: 20
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // Automatically manages created_at and updated_at
});

const User = mongoose.model('User', userSchema);
module.exports = User;
