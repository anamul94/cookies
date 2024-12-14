const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // SMTP server address (e.g., smtp.mailtrap.io)
    port: 587, // SMTP port (e.g., 587 for TLS, 465 for SSL)
    secure: false, // Use true for port 465, false for other ports
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
    },
});

// Define email options
// const mailOptions = {
//     from: process.env.EMAIL, // Sender's email address
//     to: 'recipient@example.com',    // Receiver's email address
//     subject: 'Hello from Node.js!', // Subject of the email
//     text: 'This is a test email sent using Node.js and Nodemailer.', // Plain text body
//     html: '<h1>Hello!</h1><p>This is a test email sent using Node.js and Nodemailer.</p>', // HTML body (optional)
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Error occurred:', error);
//     }
//     console.log('Email sent:', info.response);
// });

exports.sendMail = (to, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: to,    // Receiver's email address
        subject: subject, // Subject of the email
        text: message, // Plain text body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Email sent:', info.response);
    });
};
