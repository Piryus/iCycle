const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    rating: Number,
    comment: String
});

const storageSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    priceFrequency: String,
    owner: {type: mongoose.Types.ObjectId, ref: 'User'},
    address: String,
    geometry: {
        lat: Number,
        lng: Number
    },
    slots: Number,
    reviews: [reviewSchema],
    imagePath: String
});


module.exports = {
    Storage: mongoose.model('Storage', storageSchema),
    Review: mongoose.model('Review', reviewSchema)
};