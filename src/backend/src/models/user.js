const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    surname: String,
    age: Number,
    phone: String,
    address: String,
    picturePath: String
});

userSchema.virtual('storages', {
    ref: 'Storage',
    localField: '_id',
    foreignField: 'owner'
});

module.exports = mongoose.model('User', userSchema);