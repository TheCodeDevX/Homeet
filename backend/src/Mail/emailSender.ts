import 'dotenv/config'
import {
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  RESET_PASSWORD_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE, 
  WELCOME_EMAIL_TEMPLATE} 
from './templates/email.templates';
import axios from 'axios';
 const sender = process.env.USER as string;

 const brevoClient = axios.create({
  baseURL : 'https://api.brevo.com/v3',
  headers : { 'api-key' : process.env.API_KEY }
 })


  export const sendVerificationEmail = async (recipient:string, userName:string, verificationCode:number) => {

    try {
       const response = await brevoClient.post("/smtp/email", {
      sender : {
        email : sender,
        name : 'Homeet'
      },
      to : [{email : recipient}],
      subject: "Verify Your Email",
      htmlContent: VERIFICATION_EMAIL_TEMPLATE(userName, verificationCode)
    })

    console.log(response.data, 'brevo')
    } catch (error) {
      console.error("send verification email failed :", error)
    }
   
  }

  export const sendWelcomeMessage = async(userName:string, token:string, recipient:string) => {
  try {
      await brevoClient.post("/smtp/email", {
      sender : {
        email : sender,
        name : 'Homeet'
      },
      to : [{email : recipient}],
      subject: "Verify Your Email",
      htmlContent: WELCOME_EMAIL_TEMPLATE(userName, token).replaceAll("{baseURL}", `${process.env.SERVER_URL}`)
    })
  } catch(error) {
    console.error('send welocome msg failed:', error)
  }
  }

   export const sendResetPasswordRequest = async(userName: string, recipient: string, token: string) => {
   try {
    await brevoClient.post("/smtp/email", {
      sender: {
        email: sender,
        name: 'Homeet'
      },
      to: [{ email: recipient }],
      subject: 'Reset Password',
      htmlContent: RESET_PASSWORD_TEMPLATE(userName).replace("{resetURL}", `${process.env.CLIENT_URL}/reset-password/${token}`)
    });
    console.log('Reset password email sent to:', recipient);
  } catch (error) {
    console.error('Reset password email failed:', error);
    throw error;
  }
}

export const sendResetSuccessEmail = async(userName: string, recipient: string) => {
  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        email: sender,
        name: 'Homeet'
      },
      to: [{ email: recipient }],
      subject: 'Password Reset Successful',
      htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE(userName)
    });
    console.log('Password reset success email sent to:', recipient);
  } catch (error) {
    console.error('Password reset email failed:', error);
    throw error;
  }
}