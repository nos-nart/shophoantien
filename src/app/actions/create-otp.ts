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
				expires: new Date(new Date().getTime() + 1000 * 60 * 10),
				type
			})
			.returning()
			.get();
		return { otp };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		throw new Error(error);
	}
}
