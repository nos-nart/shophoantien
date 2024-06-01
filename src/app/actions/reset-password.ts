'use server';

import type { z } from 'zod';
import type { resetPasswordSchema } from '../(auth)/reset-password/[email]/[otp]/page';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export async function resetPassword(values: z.infer<typeof resetPasswordSchema>, email: string) {
	try {
		await db.update(users).set({ password: values.password }).where(eq(users.email, email));
		return {
			success: true,
			message: 'Mật khẩu của bạn đã được thay đổi thành công.'
		};
	} catch (_error) {
		return {
			success: false,
			message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
		};
	}
}
