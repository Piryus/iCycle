const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = require('./models/user');
const Booking = require('./models/booking');
app.use('/uploads', express.static('uploads'));
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});

app.use(cors());
app.use(express.json());

require('./routes/storages')(app);
require('./routes/search')(app);
require('./routes/bookings')(app);
require('./routes/users')(app);

app.post('/user', function (req, res) {
    try {
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age
        });
        user.save();
        res.send({success: true});
    } catch (e) {
        console.log(e);
    }
});

app.listen(3000);