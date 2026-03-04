import nodemailer from 'nodemailer'
import 'dotenv/config'
import { PASSWORD_RESET_SUCCESS_TEMPLATE,
   RESET_PASSWORD_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } 
from './templates/email.templates';
 const sender = process.env.USER as string;

 const transporter = nodemailer.createTransport({
  host : "smtp-relay.brevo.com",
  port : 465,
  secure : true,
  auth : {
    user : process.env.SENDER as string,
    pass: process.env.SMTP_API_KEY as string,
  },
  connectionTimeout : 10000,
 })


  export const sendVerificationEmail = async (recipient:string, userName:string, verificationCode:number) => {
   const info = await transporter.sendMail({
        from : sender,
        to: recipient,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE(userName, verificationCode)

    })

    console.log(info)
  }

  export const sendWelcomeMessage = async(userName:string, token:string, recipient:string) => {
    await transporter.sendMail({
      from :sender,
      to:recipient,
      subject: 'Welcome Email',
      html: WELCOME_EMAIL_TEMPLATE(userName, token).replaceAll("{baseURL}", `${process.env.SERVER_URL}`)
    })
  }

    export const sendResetPasswordRequest = async(userName:string, recipient:string, token:string) => {
    await transporter.sendMail({
      from :sender,
      to:recipient,
      subject: 'Reset Password',
      html: RESET_PASSWORD_TEMPLATE(userName).replace("{resetURL}",
         `${process.env.CLIENT_URL}/reset-password/${token}`)
    })
  }

    export const sendResetSuccessEmail = async(userName:string, recipient:string) => {
    await transporter.sendMail({
      from :sender,
      to:recipient,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(userName)
    })
  }