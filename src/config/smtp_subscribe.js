require("dotenv").config();

const smpt_subscribeConfig = {
  service: process.env.EMAIL_SERVER,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, //note true if the port is 465 else false
  auth: {
    user: process.env.SUBSCRIBE_EMAIL_USER,
    pass: process.env.SUBSCRIBE_EMAIL_PASSWORD,
  },
};

module.exports = smpt_subscribeConfig;
