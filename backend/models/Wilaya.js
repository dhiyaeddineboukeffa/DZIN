const mongoose = require('mongoose');

const wilayaSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    deliveryFee: {
        type: Number,
        default: 500
    },
    communes: [String]
}, { timestamps: true });

module.exports = mongoose.model('Wilaya', wilayaSchema);
