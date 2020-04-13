const {Storage} = require('../models/storage');
const Booking = require('../models/booking');
const axios = require('axios').default;
const keys = require('../../config/keys');

module.exports = (app) => {
    app.get('/search-map/', async (req, res) => {
        try {
            // Query Google Maps to geocode the address received
            const googleResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
                params: {
                    address: req.query.address,
                    key: keys.googleAPI
                }
            });

            // Query every storages in the database
            // TODO Take into consideration checkin, checkout and slots
            const storages = await Storage.find();

            // Send response
            res.send({
                geometry: googleResponse.data.results[0].geometry.location,
                storages
            });

        } catch (e) {
            console.log(e);
        }
    });

    // Storages search
    app.get('/search/', async (req, res) => {
        try {
            // Query every storages in the database
            // TODO Take into consideration checkin, checkout and slots
            let storages = await Storage.find().lean();
            for (let storage of storages) {
                const googleApiResponse = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?', {
                    params: {
                        key: keys.googleAPI,
                        origins: req.query.address,
                        destinations: storage.address,
                    }
                });
                storage.distanceToOrigin = googleApiResponse.data.rows[0].elements[0].distance;
                let ratingAverage = 0;
                for (const review of storage.reviews) {
                    ratingAverage += review.rating;
                }
                ratingAverage /= storage.reviews.length;
                storage.ratingAverage = ratingAverage;
            }
            // Send response
            res.send({
                storages
            });
        } catch (e) {
            console.log(e);
        }
    });

    // Storage infos
    app.get('/storage', async (req, res) => {
        try {
            // Query every storages in the database
            // TODO Take into consideration checkin, checkout and slots
            const storage = await Storage.findOne({_id: req.query.id}).populate("owner");

            // Send response
            res.send({
                storage
            });
        } catch (e) {
            console.log(e);
        }
    });

    app.post('/booking', async (req, res) => {
        try {
            const {storageId, checkin, checkout, slots, price} = req.body;
            const booking = new Booking({
                storage: storageId,
                booker: '5debe9f875d521ba44b677aa',
                startDate: checkin,
                endDate: checkout,
                amount: price,
                bookedSlots: slots,
                status: 'pending'
            });
            booking.save();
            res.send({success: true});
        } catch (e) {
            console.log(e);
        }
    })
};