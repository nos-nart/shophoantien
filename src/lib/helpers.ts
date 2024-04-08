import { createTransport } from "nodemailer";
import dedent from 'ts-dedent';
import { env } from "@/lib/env.mjs";

const transport = createTransport({
	service: 'gmail',
	secure: false,
	auth: {
		user: env.GMAIL_ADDRESS,
		pass: env.GMAIL_APP_PASSWORD,
	},
});

export async function sendVerificationMail(
	email: string,
	otp: string,
) {
	const message = {
		from: env.GMAIL_ADDRESS,
		to: email,
		subject: 'Xác thực tài khoản - Shophoantien',
		html: dedent`
			<div style="background: #dde6ef; padding: 20px">
				<div style="background: #fff; border-radius: 5px; padding: 20px; margin: 0 auto">
					<h2>Xin chào ${email}</h2>
					<p>Mã xác thực của bạn là: <h1 style="color: #2563eb">${otp}<h1></p>
					<p>Bạn vui lòng nhập mã xác thực này trong màn hình shophoantien để hoàn tất việc xác thực tài khoản nhé</p>
					<p>Lưu ý: <strong>Mã OTP có hiệu lực<strong> 3 phút</p>
					<p>*Đây là email tự động, vui lòng không trả lời vào hòm thư này*</p>
				</div>
			</div>
		`
	}
	transport.sendMail(message, (err: any, data: any) => {
		if (err) {
			console.log(err);
			throw new Error(err);
		} else {
			console.log('Mail sent');
		}
	});
}