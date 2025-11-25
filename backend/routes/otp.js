const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const secret = 'jai shree'; // Store securely in .env
dotenv.config();

router.use(bodyParser.json());
let otpStore = {}; // { "phonenumber": { otp:123456, expiry:Date } }

router.post('/send-otp', (req, res) => {
    const { phone, email } = req.body;
 console.log("sending otp");
    if (!phone || !email) {
        return res.status(400).send("Phone and email are required");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP with expiry 5 mins
    otpStore[phone] = { otp, expiry: Date.now() + 5 * 60 * 1000 };

    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your Tripo Verification Code',
        text: `Your OTP verification code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error sending OTP");
        } else {
            res.send("OTP sent successfully");
        }
    });
});

router.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
   console.log("checking otp");
    if (!phone || !otp) {
        return res.status(400).send("Phone and OTP are required");
    }

    if (!otpStore[phone]) {
        return res.status(400).send("OTP not requested");
    }

    // Check expiry
    if (Date.now() > otpStore[phone].expiry) {
        delete otpStore[phone];
        return res.status(400).send("OTP expired");
    }

    // Verify OTP
    if (parseInt(otp) === otpStore[phone].otp) {
        delete otpStore[phone];
           const token = jwt.sign({ phone }, secret, { expiresIn: '2h' });
    return res.json({ success: true, token });
    } else {
        res.status(400).send("Invalid OTP");
    }
});

module.exports = router;
