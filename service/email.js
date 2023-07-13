import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "738e3f4a23c363",
    pass: "4f8148a33b4c30",
  },
});

export default transporter;
