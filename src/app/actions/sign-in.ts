"use server";

import { AccountNoVerified, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signInSchema } from "../(auth)/sign-in/page";

export async function _signIn(values: z.infer<typeof signInSchema>) {
  try {
    const { email, password } = values;
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: true, message: "Đăng nhập thành công!" };
  } catch (error) {
    if (error instanceof AccountNoVerified) {
      return {
        success: false,
        message: "Tài khoản của bạn chưa được xác thực.",
        code: "account-no-verified",
      };
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            success: false,
            message: "Email hoặc mật khẩu không đúng",
            code: "incorrect-credentials",
          };
        }
        default: {
          return {
            success: false,
            message: "Đã xảy ra lỗi",
            code: "unhandled-error",
          };
        }
      }
    }
    throw error;
  }
}
