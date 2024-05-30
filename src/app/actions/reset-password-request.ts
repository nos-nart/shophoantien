'use server';

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { db } from '@/lib/db';
import { verificationTokens } from '@/lib/db/schema/auth';
import { and, eq, gt } from 'drizzle-orm';
import { env } from 'node:process';
import type { z } from 'zod';
import type { resetPasswordRequestSchema } from '../(auth)/forgot-password/page';
import { createOTP } from './create-otp';
import { transporter } from './send-verification';

export async function resetPasswordRequest(values: z.infer<typeof resetPasswordRequestSchema>) {
	try {
		const now = new Date();
		const existingToken = await db
			.select()
			.from(verificationTokens)
			.where(
				and(
					eq(verificationTokens.identifier, values.email),
					eq(verificationTokens.type, 'reset-password'),
					gt(verificationTokens.expires, now)
				)
			)
			.limit(1);
		if (existingToken.length > 0) {
			return {
				success: false,
				message: 'Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.'
			};
		}
		const { otp } = await createOTP(values.email, 'reset-password');
		const emailsDir = path.resolve(process.cwd(), 'src', 'emails');
		const emailFile = readFileSync(path.join(emailsDir, 'reset-password-email.html'), {
			encoding: 'utf8'
		});
		const emailTemplate = Handlebars.compile(emailFile);
		transporter.sendMail({
			from: env.GMAIL_ADDRESS,
			to: values.email,
			subject: 'Lấy lại mật khẩu - Shophoantien',
			html: emailTemplate({
				base_url: 'https://shophoantien.vercel.app',
				otp
			})
		});
		return {
			success: true,
			message: 'Vui lòng kiểm tra email để lấy lại mật khẩu.'
		};
	} catch (_error) {
		return {
			success: false,
			message: 'Đã xảy ra lỗi khi xử lý yêu cầu đặt lại mật khẩu của bạn. Vui lòng thử lại sau.'
		};
	}
}
