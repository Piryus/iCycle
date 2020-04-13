const User = require('../models/user');
const Booking = require('../models/booking');

const crypto = require('crypto');
const multer  = require('multer');
let storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(20).toString('hex'))
    }
});
const upload = multer({ storage });


module.exports = (app) => {
    app.get('/auth', async (req, res) => {
        // TODO Validate body
        // TODO Return bookings information
        const defaultUser = await User.findOne({_id: '5debe9f875d521ba44b677aa'}).lean();
        const pendingBookings = await Booking.find({status: 'pending'}).populate('storage').lean();
        const userPendingBookings = pendingBookings.filter(pendingBooking => {
            return pendingBooking.storage.owner.toString() === '5debe9f875d521ba44b677aa';
        });
        defaultUser.pendingBookings = userPendingBookings.length;
        defaultUser.picturePath = 'http://localhost:3000/' + defaultUser.picturePath;
        res.send(defaultUser);
    });

    app.patch('/user', upload.single('image'), async (req, res) => {
        try {
            const user = await User.findById('5debe9f875d521ba44b677aa');
            user.name = req.body.name;
            user.surname = req.body.surname;
            user.email = req.body.email;
            user.phone = req.body.phone;
            if (req.file)
                user.picturePath = req.file.path.replace(/\\/g, "/");
            await user.save();
            res.send({success: true});
        } catch (e) {
            console.log(e);
        }
    });
};