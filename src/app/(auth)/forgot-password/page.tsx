'use client';

import { forgotPassword } from '@/app/actions/forgot-password';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEmailStore } from '@/stores/emailStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' })
});

const Page = () => {
	const [loading, setLoading] = useState(false);
	const { setEmail } = useEmailStore();
	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: ''
		}
	});

	async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
		setEmail(values.email);
		setLoading(true);
		try {
			const { success, message } = await forgotPassword(values);
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
					<h2 className='text-2xl font-bold'>Lấy lại mật khẩu</h2>
					<p className='my-2 text-gray-600'>Nhập email của bạn để lấy lại mật khẩu</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input disabled={loading} placeholder='your.email@example.com' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={loading} className='w-full' type='submit'>
							{loading && <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />}
							Lấy lại mật khẩu
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Page;
