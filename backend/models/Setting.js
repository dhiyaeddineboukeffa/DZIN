const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    },
    description: String,
    isPublic: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
