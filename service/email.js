import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
    port: 587,
  auth: {
    user: "selena23@ethereal.email",
    pass: "Num5TpnFrpYnkeQzsg",
  },
});

export default transporter;