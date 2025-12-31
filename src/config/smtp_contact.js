require('dotenv').config();

const smpt_contactConfig = {
  service: process.env.EMAIL_SERVER,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, //note true if the port is 465 else false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

module.exports = smpt_contactConfig;    
  