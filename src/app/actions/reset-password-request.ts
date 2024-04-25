"use server";

import { z } from "zod";
import { resetPasswordRequestSchema } from "../(auth)/forgot-password/page";
import { createOTP } from "./create-otp";
import path from "path";
import { readFileSync } from "fs";
import { env } from "process";
import { transporter } from "./send-verification";

export async function resetPasswordRequest(
  values: z.infer<typeof resetPasswordRequestSchema>
) {
  try {
    const { otp } = await createOTP(values.email, "reset-password");
    const emailsDir = path.resolve(process.cwd(), "src", "emails");
    const emailFile = readFileSync(
      path.join(emailsDir, "reset-password-email.html"),
      {
        encoding: "utf8",
      }
    );
    const emailTemplate = Handlebars.compile(emailFile);
    transporter.sendMail({
      from: env.GMAIL_ADDRESS,
      to: values.email,
      subject: "Lấy lại mật khẩu - Shophoantien",
      html: emailTemplate({
        base_url: "https://shophoantien.vercel.app",
        otp,
      }),
    });
    return {
      success: true,
      message: "Vui lòng kiểm tra email để lấy lại mật khẩu.",
    };
  } catch (error) {}
}
