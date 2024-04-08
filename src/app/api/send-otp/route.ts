import { sendVerificationMail } from "@/lib/helpers";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { otp, email } = body as { otp: string, email: string };

		if (!otp || !email) {
			return new Response(JSON.stringify({ error: 'OTP and email are required fields' }), { status: 400 });
		}

		await sendVerificationMail(email, otp);

		return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}