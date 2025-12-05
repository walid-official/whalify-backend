

import nodemailer from "nodemailer";
import config from "../../config";


export const sendOTPEmail = async (email:string, otp:string) => {
    try {

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:config.EMAIL_USER,
                pass:config.EMAIL_PASS,
            }
        });

        
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Use the following OTP to login:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #333;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <br />
          <small>If you did not request this, please ignore this email.</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
        console.log("📧 OTP Email sent to:", email);




        
    } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send OTP email");
        
    }
}