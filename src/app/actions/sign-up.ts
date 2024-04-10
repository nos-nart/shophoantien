"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { signUpFormSchema } from "../(auth)/sign-up/page";
import { nanoid } from "nanoid";
import { createOtp } from "./create-otp";
import { sendOtp } from "./send-otp";

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
  try {
    const { email } = values;
    const existed = await db.select().from(users).where(eq(users.email, email));
    if (existed.length > 0) {
      return {
        success: false,
        isVerified: Boolean(existed[0].emailVerified),
        message:
          "Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.",
      };
    }
    await db.insert(users).values({ email, id: nanoid() });
    const { otp } = await createOtp(email);
    await sendOtp(email, otp);
    return {
      success: true,
      message: "Vui lòng kiểm tra email của bạn để xác minh tài khoản.",
    };
  } catch (error: any) {
    return { success: false, message: "Lỗi phía máy chủ" };
  }
}
