'use server';

import { db } from '@/lib/db';
import { verificationTokens } from '@/lib/db/schema/auth';
import { generateOTP } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';

export async function createOTP(email: string, type: 'verify-account' | 'reset-password') {
	try {
		await db
			.delete(verificationTokens)
			.where(and(eq(verificationTokens.identifier, email), eq(verificationTokens.type, type)))
			.run();
		const otp = generateOTP();
		await db
			.insert(verificationTokens)
			.values({
				identifier: email,
				token: otp,
				// expires in 10 minutes
				expires: new Date(new Date().getTime() + 1000 * 60 * 10),
				type
			})
			.returning()
			.get();
		return { otp, message: 'Tạo thành công mã OTP' };
	} catch (_error) {
		return { otp: null, message: 'Đã có lỗi xảy ra!' };
	}
}
