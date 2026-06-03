import nodemailer from 'nodemailer';
import ejs from 'ejs';

import { ENV } from '../Services/env.js';

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OTP_TemplatePath = path.join(__dirname, "../Template/OTPTemplate.ejs");



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export const sendOTP = async (name, email, OTP) => {
  const html = await ejs.renderFile(OTP_TemplatePath, { name, OTP });
  const mailOptions = {
    from: ENV.EMAIL_USER,
    to: email,
    subject: 'Confirm Your OTP',
    html: html,
  };
  await transporter.sendMail(mailOptions);
};
