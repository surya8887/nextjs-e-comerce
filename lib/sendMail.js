import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: process.env.NODEMAILER_PORT == 465, // true for 465, false otherwise
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS, // ✅ use env variable
      },
    });

    const options = {
      from: `"Surya Export And Import" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(options);

    console.log("Message sent:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Mail send failed:", error.message);
    return { success: false, message: error.message };
  }
};
