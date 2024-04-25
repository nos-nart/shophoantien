"use server";

import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema/auth";
import { and, eq, sql } from "drizzle-orm";

export async function verifyOTP(otp: string, identifier: string) {
  try {
    const currentTime = Date.now();
    const foundToken = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, otp),
          eq(verificationTokens.type, "verified")
        )
      )
      .get();
    if (foundToken != null) {
      if ((currentTime - Number(foundToken.expires)) / 1000 / 60 >= 10) {
        return { success: false, message: "Mã xác thực đã hết hạn." };
      }
      const result = await db
        .update(users)
        .set({ emailVerified: sql`${new Date().toISOString()}` })
        .where(eq(users.email, identifier))
        .get();
      console.log(result);
      if (!result) {
        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
      }
      return { success: true, message: "Tài khoản của bạn đã được xác thực." };
    } else {
      return { success: false, message: "Nhập sai hoặc OTP đã hêt hạn." };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
