import nodemailer from "nodemailer";
// Helper to send OTP emails

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Amogh Academy Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 15px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-weight: 900; margin: 0; font-size: 28px;">AMOGH ACADEMY</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Verification Portal</p>
        </div>
        
        <div style="padding: 30px; background-color: #f8fafc; border-radius: 12px; text-align: center;">
          <h2 style="color: #0f172a; margin-top: 0;">Verification Code</h2>
          <p style="color: #64748b; margin-bottom: 25px;">Use the following code to sign in to your account. This code will expire in 5 minutes.</p>
          
          <div style="background-color: #ffffff; border: 2px solid #e2e8f0; padding: 15px; border-radius: 10px; display: inline-block;">
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #1e293b;">${otp}</span>
          </div>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error };
  }
};
