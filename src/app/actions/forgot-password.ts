'use server';

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema/auth';
import { and, eq, gt, sql } from 'drizzle-orm';
import { env } from 'node:process';
import type { z } from 'zod';
import type { forgotPasswordSchema } from '../(auth)/forgot-password/page';
import { createOTP } from './create-otp';
import nodemailer from 'nodemailer';
import type { TransportOptions } from 'nodemailer';
import Handlebars from 'handlebars';

export async function forgotPassword(values: z.infer<typeof forgotPasswordSchema>) {
	try {
		const user = await db.select().from(users).where(eq(users.email, values.email)).get();
		if (!user) {
			// The canonical way Password Reset works has always been to send an email to a user that does exist, And not giveaway clues whether the email exists or no…
			throw new Error('Something went wrong!');
		}
		if (!user.emailVerified) {
			return {
				success: false,
				message: 'Tài khoản của bạn chưa được xác thực.'
			};
		}
		const transporter = nodemailer.createTransport<TransportOptions>({
			service: 'gmail',
			secure: false,
			auth: {
				user: env.GMAIL_ADDRESS,
				pass: env.GMAIL_APP_PASSWORD
			}
		} as TransportOptions);
		const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
		const existingToken = await db
			.select()
			.from(verificationTokens)
			.where(
				and(
					eq(verificationTokens.identifier, values.email),
					eq(verificationTokens.type, 'reset-password'),
					gt(verificationTokens.expires, sql`${tenMinutesAgo}`)
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
				base_url: env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://shophoantien.vercel.app',
				email: values.email,
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
