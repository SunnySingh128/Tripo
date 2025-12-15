const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

// Brevo SDK
const Brevo = require("@getbrevo/brevo");

const secret = process.env.SECRET;

router.use(bodyParser.json());

let otpStore = {};
// Format: { "phone": { otp:123456, expiry:Date } }

// Initialize Brevo API
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.API_KEY // Your SMTP API key
);
// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone || !email) {
      return res.status(400).send("Phone and email are required");
    }

    console.log("Sending OTP...");

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[phone] = { otp, expiry: Date.now() + 5 * 60 * 1000 };

    // Create email structure
     let apiInstance = new Brevo.TransactionalEmailsApi();
     
     let apiKey = apiInstance.authentications["apiKey"];
     apiKey.apiKey = process.env.API_KEY; // Store this in .env

     console.log(process.env.API_KEY)
     
     let sendSmtpEmail = new Brevo.SendSmtpEmail();
     
     sendSmtpEmail.subject = "My Test Email";
     sendSmtpEmail.htmlContent =
     "<html><body><h1>" + otp +"</h1></body></html>";
     sendSmtpEmail.sender = { name: "My App", email: process.env.EMAIL }; // Must match the email you verified!
     sendSmtpEmail.to = [
         { email: email, name: "sunny" },
        ];
        
    
    apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      console.log("API called successfully. Returned data: ");
    })
    .catch(err =>{
        console.log(err.message)
    })

    return res.send("OTP sent successfully");
  } catch (err) {
    console.error("Brevo Error:");
    return res
      .status(500)
      .send(
        "Error sending OTP. Please check your SMTP API key and sender email."
      );
  }
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).send("Phone and OTP are required");
  }

  if (!otpStore[phone]) {
    return res.status(400).send("OTP not requested");
  }

  console.log("Checking OTP...");

  if (Date.now() > otpStore[phone].expiry) {
    delete otpStore[phone];
    return res.status(400).send("OTP expired");
  }

  if (parseInt(otp) === otpStore[phone].otp) {
    delete otpStore[phone];

    const token = jwt.sign({ phone }, process.env.SECRET, { expiresIn: "2h" });

    return res.json({ success: true, token });
  } else {
    return res.status(400).send("Invalid OTP");
  }
});

module.exports = router;
