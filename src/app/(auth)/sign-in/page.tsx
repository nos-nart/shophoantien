'use client';

import { _signIn } from '@/app/actions/sign-in';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useEmailStore } from '@/stores/emailStore';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const signInSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	password: z.string().regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/), {
		message:
			'Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một ký tự viết hoa, một ký tự viết thường và một ký hiệu đặc biệt'
	})
});

const Page = () => {
	const [isPending, startTransition] = useTransition();
	const showVerifiedLinkRef = useRef(false);
	const { setEmail } = useEmailStore();
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		showVerifiedLinkRef.current = false;
		startTransition(async () => {
			try {
				const result = await _signIn(values);
				if (result.success) {
					toast.success('Thành công', {
						description: result.message
					});
				} else {
					const errorCode = result?.code;
					if (errorCode === 'account-no-verified') {
						setEmail(values.email);
						toast.warning(result.message, {
							description: 'Nhấp vào liên kết bên dưới để xác minh tài khoản của bạn'
						});
						showVerifiedLinkRef.current = true;
						return;
					}
					toast.warning(result.message);
				}
			} catch (error) {
				console.error(error);
			}
		});
	}

	return (
		<div className='grid lg:grid-cols-2 gap-12' style={{ width: 'min(70ch, 100vw - 2rem)' }}>
			<div className='lg:grid hidden place-content-center'>
				<Image src='/say-hi.png' alt='say-hi' width={200} height={200} />
			</div>
			<div>
				<div className='py-6'>
					<h2 className='text-2xl font-bold'>Đăng nhập</h2>
					<p className='my-2 text-gray-600'>Mua hàng hoàn tiền lên đến 80%</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input disabled={isPending} placeholder='your.email@example.com' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput id='password' disabled={isPending} placeholder='Mật khẩu của bạn' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{showVerifiedLinkRef.current && (
							<div className='flex mt-0'>
								<Link className='text-blue-500 hover:underline' href='/verified'>
									Xác thực tài khoản
								</Link>
							</div>
						)}
						<Button className='w-full' type='submit'>
							Đăng nhập
						</Button>
					</form>
				</Form>
				<div className='mt-2'>
					<Link className='text-blue-500 hover:underline' href='/forgot-password'>
						Lấy lại mật khẩu
					</Link>
					<div className='mt-6'>
						Bạn chưa có tài khoản?{' '}
						<Link className='text-blue-500 hover:underline' href='/sign-up'>
							Đăng kí
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
