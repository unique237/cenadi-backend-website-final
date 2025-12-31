const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const smtp_subConfig = require('../config/smtp_subscribe');

const sendSubscribeMail = async (req, res) => {
    try {
        const { email } = req.body;

        // Create transporter
        const transporter = nodemailer.createTransport(smtp_subConfig);

        // Render email template
        const html = await ejs.renderFile(
            path.join(__dirname, '../views/subscribeView.ejs'),
            { email }
        );

        //email options
        const mailOptions = {
            from: smtp_subConfig.auth.user, // Sender
            to: smtp_subConfig.auth.user, // Your email (receiving contact form)
            subject: 'New Subscriber', // Subject line
            html: html
        };
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'Subscription successful!'
        });
    } catch (error) {
        console.error('Error sending subscription email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.'
        });
    }
};

module.exports = { sendSubscribeMail };