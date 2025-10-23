
export const VERIFICATION_EMAIL_TEMPLATE = (userName, verificationCode) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color:#333; background-color: #eee; max-width: 600px; margin: 0 auto;
padding: 20px;">
    <div style="text-align: center; padding: 20px; background: linear-gradient(to left, #7037AD, #5904B4);">
        <h1 style="color: #fff; margin: 0;">Verify Your Email</h1>
    </div>

    <div style="background-color: #ffffff; padding: 20px 0; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
       <div style="padding: 0 20px;">
         <p style="font-size: 18px;  opacity: 0.9;">Hello <span style="color: #5904B4;">${userName}</span>,</p>
        <p style="font-size: 16px; opacity: 0.9; ">Thank you for signing up! Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5904B4;
            user-select: all; overflow-wrap: break-word;">${verificationCode}</span>
        </div>
    <p style="font-size: 15px; opacity: 0.9;">Enter this code on the verification page to complete your registration.</p>
    <p style="font-size: 15px; opacity: 0.9;">This code will expire in <strong>15 minutes</strong>. If you didn’t sign up, you can ignore this email.</p>
   <p style="text-align: center; margin: 50px 0;
   ">
     <a style=" display: inline-block;
       text-decoration: none; color: white; font-size: 18px; font-weight: bold;
       background: linear-gradient(to left,#7037AD, #5904B4); padding: 18px 28px; border-radius: 4px; " href="/">
       Verify Your Email</a>

   </p>

    <p style="font-size: 15px; opacity: .9; ">Best regards,<br>The <span style="color: #5904B4; font-weight: bold;">Homeet </span>Team</p>
       </div>
     <hr style="opacity: .5;">
     <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p style="text-align: center;" >This is an automated message, please do not reply to this email.</p>
  </div>  
</div>
</body>
</html>
`

export const WELCOME_EMAIL_TEMPLATE = (userName, token) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Email!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 30px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(to left, #7037AD, #5904B4); 
            border-top-left-radius: 10px; border-top-right-radius: 10px;">
              <h1 style="color: #ffffff; margin: 0;">Homeet</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 30px;">
              <h1 style="font-size: 24px; color: #111111d7; margin-bottom: 10px;">Welcome to Homeet, <span style="color: #5904B4;">${userName || 'User'}</span>!</h1>
              <h2 style="font-size: 18px; color: #444; font-weight: 300; margin: 0;">Hi <span style="color: #5904B4;">${userName || 'User'}</span>,</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 15px 30px 0 30px; color: #444; font-size: 14px;">
              <p style="margin-bottom: 10px;">Thank you for joining <strong>Homeet!</strong> We're excited to have you.</p>
              <p style="margin-bottom: 20px;">Get started now by completing your profile or exploring the features!</p>
              <span style="font-size: 12px; color: #555;">To get started, take this next step:</span>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 30px;">
              <a href="http://localhost:8000/api/subscription/subscribe?token=${token}" target="_blank"
                 style="display: inline-block; padding: 15px 30px; background: linear-gradient(to left, #7037AD, #5904B4); color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 10px;">
                Subscribe
              </a>
            </td>
          </tr>

          <!-- Support & Footer -->
          <tr>
            <td style="padding: 0 30px; font-size: 14px; color: #444;">
              <p style="font-size: 12px; margin-bottom: 20px;">Need help? Visit our support center or reply to this email.</p>
              <p style="margin: 0;">Cheers,</p>
              <p style="margin-top: 5px;">The <strong>Homeet</strong> Team</p>
              <hr style="margin: 20px 0; opacity: 0.5;" />
            </td>
          </tr>

          <!-- Unsubscribe -->
          <tr>
            <td align="center" style="font-size: 13px; color: #555; font-style: italic; padding-bottom: 30px;">
              <span>If you'd rather not receive emails from us, you can </span>
              <a href="http://localhost:8000/api/subscription/unsubscribe?token=${token}" target="_blank"
                 style="color: #0077ff; text-decoration: underline;">unsubscribe here</a>.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;


export const RESET_PASSWORD_TEMPLATE = (userName) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color:#333; max-width: 600px; margin: 0 auto;
padding: 20px;">
    <div style="text-align: center; padding: 20px; border-top-left-radius: 5px ; border-top-right-radius: 5px;  background: linear-gradient(to left, #7037AD, #5904B4);">
        <h1 style="color: #fff; margin: 0;">Password Reset</h1>
    </div>

    <div style="background-color: #f9f9f9; padding: 20px;  box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p style="opacity: .8; font-size: 20px;">Hello <strong>${userName}</strong>,</p>
        <p style="opacity: .8; font-size: 15px;">We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
        <p style="opacity: .8; font-size: 15px;">To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color:  #5904B4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p style="opacity: .8; font-size: 15px;">This link will expire in 1 hour for security reasons.</p>
    <p style="opacity: .8; font-size: 15px;">Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>`;

 
 export const PASSWORD_RESET_SUCCESS_TEMPLATE = (userName) =>  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style=" background: linear-gradient(to left, #7037AD, #5904B4); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello <strong>${userName || "User"}</strong> ,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #5904B4; color: white; width: 50px; height: 50px; line-height: 50px; 
      border-radius: 50%; display: inline-block; font-size: 30px; text-align: center;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your <strong>Homeet</strong> Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>`