"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signInSchema } from "../(auth)/sign-in/page";

export async function _signIn(values: z.infer<typeof signInSchema>) {
  const validateFields = signInSchema.safeParse(values);
  if (!validateFields.success) {
    return { success: false, message: "Email hoặc password không hợp lệ" };
  }
  const { email, password } = validateFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { success: false, message: "Email hoặc mật khẩu không đúng" };
        }
        default: {
          return { success: false, message: "Đã xảy ra lỗi" };
        }
      }
    }

    throw error;
  }

  return { success: true, message: "Đăng nhập thành công!" };
}
