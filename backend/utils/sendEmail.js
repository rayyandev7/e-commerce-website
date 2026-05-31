import nodemailer from "nodemailer";

// Sends an email via Gmail. `content` may be plain text or HTML.
const sendEmail = async (to, subject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: content,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;
