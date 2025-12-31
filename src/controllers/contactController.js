const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const smtpConfig = require('../config/smtp_contact');

const sendContactEmail = async (req, res) => {
  try {
    const { title, first_name, last_name, subject, email, message } = req.body;

    // Validation
    if (!title || !first_name || !last_name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Render email template
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/contactView.ejs'),
      { title, first_name, last_name, subject, email, message }
    );

    // Email options
    const mailOptions = {
      from: `"${first_name} ${last_name}" <${smtpConfig.auth.user}>`, // Sender
      to: smtpConfig.auth.user, // Your email (receiving contact form)
      replyTo: email, // User's email for easy reply
      subject: `New Contact Form Submission from ${first_name} ${last_name}`, // Subject line
      html: html
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully!' 
    });

  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
};

module.exports = { sendContactEmail };