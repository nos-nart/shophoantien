'use server';

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { env } from '@/lib/env.mjs';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import type { TransportOptions } from 'nodemailer';
import { createOTP } from './create-otp';

export const transporter = nodemailer.createTransport<TransportOptions>({
	service: 'gmail',
	secure: false,
	auth: {
		user: env.GMAIL_ADDRESS,
		pass: env.GMAIL_APP_PASSWORD
	}
} as TransportOptions);

export async function sendVerification(identifier: string) {
	try {
		const { otp } = await createOTP(identifier, 'verify-account');
		const emailsDir = path.resolve(process.cwd(), 'src', 'emails');
		const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
			encoding: 'utf8'
		});
		const emailTemplate = Handlebars.compile(emailFile);
		transporter.sendMail({
			from: env.GMAIL_ADDRESS,
			to: identifier,
			subject: 'Xác thực tài khoản - Shophoantien',
			html: emailTemplate({
				base_url: 'https://shophoantien.vercel.app',
				otp
			})
		});
		return {
			success: true,
			message: 'Vui lòng kiểm tra email để xác thực tài khoản.'
		};
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		throw new Error(error);
	}
}
