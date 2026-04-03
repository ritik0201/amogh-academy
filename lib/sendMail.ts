import nodemailer from "nodemailer";

interface SendMailOptions {
  name: string;
  phone: string;
  email: string;
  course?: string;
  message?: string;
}

export const sendMail = async ({ name, phone, email, course, message }: SendMailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "ayushttf@gmail.com",
      subject: `New Amogh Academy Inquiry: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">New Student Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 30%;">Full Name</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone Number</td>
              <td style="padding: 10px 0; color: #0f172a;">${phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email Address</td>
              <td style="padding: 10px 0; color: #0f172a;">${email}</td>
            </tr>
            ${course ? `
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Course Checked</td>
              <td style="padding: 10px 0; color: #0f172a;">${course}</td>
            </tr>
            ` : ""}
            ${message ? `
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; padding-top: 20px; color: #64748b; font-weight: bold;">Message</td>
              <td style="padding: 10px 0; padding-top: 20px; color: #0f172a;">${message}</td>
            </tr>
            ` : ""}
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">This lead was generated automatically from your website form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
