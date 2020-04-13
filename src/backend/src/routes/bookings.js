const Booking = require('../models/booking');

module.exports = (app) => {
    // Main bookings route, returns the list of bookings of the user
    app.get('/bookings', async (req, res) => {
        try {
            // Query every bookings for connected user
            const bookings = await Booking.find({booker: '5debe9f875d521ba44b677aa'})
                .populate('storage');

            // Send response
            res.send({
                bookings
            });
        } catch (e) {
            console.log(e);
        }
    });

    // Route to get booking data
    app.get('/booking', async (req, res) => {
        const booking = await Booking.findOne({_id: req.query.id}).populate({
            path: 'storage', populate: {
                path: 'owner'
            }
        }).populate('booker');
        res.send({booking});
    });

    app.patch('/booking', async (req, res) => {
        try {
            await Booking.update({_id: req.body.bookingId}, {status: req.body.status});
            res.send({success: true});
        } catch (e) {
            console.log(e);
        }
    });
};