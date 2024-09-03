const nodemailer = require('nodemailer');
require('dotenv').config();
// 
const mailTransporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_SERVICE_MAIL,
        pass: process.env.NODEMAILER_SERVICE_PASS,
    }
});
// 
module.exports = { mailTransporter };