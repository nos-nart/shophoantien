"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { signUpFormSchema } from "../(auth)/sign-up/page";
import { nanoid } from "nanoid";
import { sendVerification } from "./send-verification";
import * as argon2 from "argon2";

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
  try {
    const { email, password } = values;
    const existed = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (existed != null) {
      return {
        success: false,
        isVerified: Boolean(existed.emailVerified),
        message:
          "Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.",
      };
    }
    const pwHash = await argon2.hash(password);
    await db
      .insert(users)
      .values({ email, id: nanoid(), password: pwHash })
      .returning()
      .get();
    await sendVerification(email);
    return {
      success: true,
      message: "Vui lòng kiểm tra email của bạn để xác thực tài khoản.",
    };
  } catch (error: any) {
    return { success: false, message: "Lỗi phía máy chủ" };
  }
}
