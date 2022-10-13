const nodemailer = require( "nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SENDGRID_HOST,
  port: process.env.SENDGRID_PORT,
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD,
  },
});


module.exports = {
  transporter: transporter,
}
