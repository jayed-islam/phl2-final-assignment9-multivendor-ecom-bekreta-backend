// import nodemailer from 'nodemailer';
// import AppError from '../errors/AppError';
// import httpStatus from 'http-status';

// export const sendEmail = async (to: string, html: string, subject: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com.',
//       port: 587,
//       secure: true,
//       auth: {
//         // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//         user: 'jayedbagerhat@gmail.com',
//         pass: 'mnns zphg gzoq xnca',
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     await transporter.sendMail({
//       from: 'jayedbagerhat@gmail.com', // sender address
//       to, // list of receivers
//       subject: subject, // Subject line
//       text: html, // plain text body
//       html, // html body
//     });

//     // console.log('Message sent: %s', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email');
//   }
// };

import nodemailer from 'nodemailer';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const sendEmail = async (to: string, html: string, subject: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: 'jayedbagerhat@gmail.com',
        pass: 'mnns zphg gzoq xnca', // App Password
      },
      tls: {
        rejectUnauthorized: false, // Optional for self-signed certificates
      },
    });

    await transporter.sendMail({
      from: 'jayedbagerhat@gmail.com', // sender address
      to, // list of receivers
      subject, // Subject line
      text: html, // plain text body
      html, // HTML body
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email');
  }
};
