"use server";

import Handlebars from "handlebars";
import { readFileSync } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import type { TransportOptions } from "nodemailer";
import { env } from "@/lib/env.mjs";
import { createOtp } from "./create-otp";

const transporter = nodemailer.createTransport<TransportOptions>({
  service: "gmail",
  secure: false,
  auth: {
    user: env.GMAIL_ADDRESS,
    pass: env.GMAIL_APP_PASSWORD,
  },
} as TransportOptions);

export const sendVerification = async (identifier: string) => {
  const { otp } = await createOtp(identifier);
  const emailsDir = path.resolve(process.cwd(), "src", "emails");
  const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
    encoding: "utf8",
  });
  const emailTemplate = Handlebars.compile(emailFile);
  transporter.sendMail({
    from: env.GMAIL_ADDRESS,
    to: identifier,
    subject: "Xác thực tài khoản - Shophoantien",
    html: emailTemplate({
      base_url: "https://shophoantien.vercel.app",
      otp,
    }),
  });
};
