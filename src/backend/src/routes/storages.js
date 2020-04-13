const crypto = require('crypto');
const multer = require('multer');
let storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(20).toString('hex'))
    }
});
const upload = multer({storage});
const {Storage} = require('../models/storage');
const {Review} = require("../models/storage");
const Booking = require('../models/booking');
const axios = require('axios').default;
const keys = require('../../config/keys');

module.exports = (app) => {
    app.post('/storages/new', upload.single('image'), async (req, res) => {
        try {
            // Query Google Maps to geocode the address of the storage
            const googleResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
                params: {
                    address: req.body.address,
                    key: keys.googleAPI
                }
            });

            const storage = new Storage({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                priceFrequency: req.body.priceFrequency,
                owner: '5debe9f875d521ba44b677aa', // TODO Use PassportJS
                address: googleResponse.data.results[0].formatted_address,
                slots: req.body.slots,
                geometry: googleResponse.data.results[0].geometry.location,
                reviews: [],
                imagePath: req.file.path.replace(/\\/g, "/")
            });
            await storage.save();
            res.send({success: true});
        } catch (e) {
            console.log(e);
        }
    });

    app.patch('/storages/edit', upload.single('image'), async (req, res) => {
        try {
            const storage = await Storage.findById(req.body.id);
            storage.name = req.body.name;
            storage.description = req.body.description;
            storage.price = req.body.price;
            storage.priceFrequency = req.body.priceFrequency;
            storage.slots = req.body.slots;
            if (req.file)
                storage.imagePath = req.file.path.replace(/\\/g, "/");
            await storage.save();
            res.send({success: true});
        } catch (e) {
            console.log(e);
        }
    });

    app.get('/storages', async (req, res) => {
        let storages = await Storage.find({owner: '5debe9f875d521ba44b677aa'}).lean();
        for (const storage of storages) {
            storage.bookings = await Booking.count({storage: storage._id});
        }
        res.send(storages);
    });

    app.get('/storages-bookings', async (req, res) => {
        try {
            // Query every bookings for connected user
            const bookings = await Booking.find().populate('storage').populate('booker');

            // Send response
            res.send({
                bookings
            });
        } catch (e) {
            console.log(e);
        }
    });

    app.post('/review', async (req, res) => {
        let booking = await Booking.findById(req.body.bookingId);
        const review = new Review({
            userId: '5debe9f875d521ba44b677aa',
            rating: req.body.rating,
            comment: req.body.comment
        });
        await Booking.update({_id: req.body.bookingId}, {reviewLeft: true});
        await Storage.update({_id: booking.storage}, {$push: {reviews: review}});
        res.send({success: true});
    });
};