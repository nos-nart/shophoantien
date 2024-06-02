'use client';

import { resetPassword } from '@/app/actions/reset-password';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const resetPasswordSchema = z
	.object({
		password: z.string().refine((val) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val), {
			message:
				'Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một ký tự viết hoa, một ký tự viết thường và một ký hiệu đặc biệt'
		}),
		confirmPassword: z.string()
	})
	.superRefine((val, ctx) => {
		if (val.password !== val.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['confirmPassword'],
				message: 'Mật khẩu không giống nhau'
			});
		}
	});

const Page = () => {
	const params = useParams<{ email: string; otp: string }>();
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: ''
		}
	});

	async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
		setLoading(true);
		try {
			const { success, message } = await resetPassword(values, params.email);
			toast[success ? 'success' : 'error'](message);
		} catch (_) {
			toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='grid lg:grid-cols-2 gap-12' style={{ width: 'min(70ch, 100vw - 2rem)' }}>
			<div className='lg:grid hidden place-content-center'>
				<Image src='/thinking.png' alt='thinking' width={200} height={200} />
			</div>
			<div>
				<div className='py-6'>
					<h2 className='text-2xl font-bold'>Đặt lại mật khẩu</h2>
					<p className='my-2 text-gray-600'>Nhập mật khẩu mới cho tài khoản</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput id='password' disabled={loading} placeholder='Mật khẩu mới' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput
											id='confirm-password'
											disabled={loading}
											placeholder='Nhập lại mật khẩu'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={loading} className='w-full' type='submit'>
							{loading && <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />}
							Đặt lại mật khẩu
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Page;
