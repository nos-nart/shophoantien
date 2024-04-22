import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema/auth";
import { generateOTP } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function createOtp(email: string) {
  try {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .run();
    const otp = generateOTP();
    await db
      .insert(verificationTokens)
      .values({
        identifier: email,
        token: otp,
        expires: new Date(new Date().getTime() + 1000 * 60 * 10),
      })
      .returning()
      .get();
    return { otp };
  } catch (error: any) {
    throw new Error(error);
  }
}
