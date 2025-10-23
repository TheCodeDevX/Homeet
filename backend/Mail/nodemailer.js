import nodemailer from 'nodemailer'
import 'dotenv/config'
import { PASSWORD_RESET_SUCCESS_TEMPLATE, RESET_PASSWORD_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } 
from './templates/email.templates.js';
 const sender = process.env.SENDER;
//  const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port : 587,
//     secure:false,
//     auth:{
//         user : sender,
//         pass : process.env.SMTP_API_KEY
//     }
//  })

 const transporter = nodemailer.createTransport({
  service:"gmail",
  auth : {
    user : "hajarrian2227@gmail.com",
    pass: process.env.EMAIL_PASSWORD
  }
 })


  export const sendVerificationEmail = async (recipient, userName, verificationCode) => {
   const info = await transporter.sendMail({
        from : sender,
        to: recipient,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE(userName, verificationCode)

    })

    console.log(info)
  }

  export const sendWelcomeMessage = async(userName, token, recipient) => {
    await transporter.sendMail({
      from :sender,
      to:recipient,
      subject: 'Welcome Email',
      html: WELCOME_EMAIL_TEMPLATE(userName, token)
    })
  }

    export const sendResetPasswordRequest = async(userName, recipient, token) => {
    await transporter.sendMail({
      from :sender,
      to:recipient,
      subject: 'Reset Password',
      html: RESET_PASSWORD_TEMPLATE(userName).replace("{resetURL}",
         `${process.env.CLIENT_URL}/reset-password/${token}`)
    })
  }

    export const sendResetSuccessEmail = async(userName, recipient, token) => {
    await transporter.sendMail({
      from :sender,
      to:recipient,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(userName)
    })
  }