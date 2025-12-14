const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Hoodies', 'Streetwear', 'Anime', 'Accessories', 'Sportswear']
    },
    image: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36']
    }],
    colors: [{
        type: String
    }],
    inStock: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
