const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    storage: {type: mongoose.Types.ObjectId, ref: 'Storage'},
    booker: {type: mongoose.Types.ObjectId, ref: 'User'},
    startDate: Date,
    endDate: Date,
    amount: Number,
    bookedSlots: Number,
    status: String,
    reviewLeft: Boolean
});

module.exports = mongoose.model('Booking', bookingSchema);