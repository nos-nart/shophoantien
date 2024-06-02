'use client';

import { sendVerification } from '@/app/actions/send-verification';
import { signUp } from '@/app/actions/sign-up';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useEmailStore } from '@/stores/emailStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const signUpFormSchema = z
	.object({
		email: z.string().trim().email({ message: 'Email không hợp lệ' }),
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

export type SignUpType = z.infer<typeof signUpFormSchema>;

const Page = () => {
	const [loading, setLoading] = useState(false);
	const { setEmail } = useEmailStore();
	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: ''
		}
	});
	const isVerifiedRef = useRef<boolean | undefined>(undefined);
	const emailRef = useRef('');

	async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
		isVerifiedRef.current = undefined;
		setLoading(true);
		try {
			const { message, success, isVerified } = await signUp(values);
			if (success) {
				toast.success('Thành công', {
					description: message
				});
				setEmail(values.email);
				redirect('/verified');
			} else {
				if (isVerifiedRef !== undefined) {
					if (isVerified === false) {
						toast.warning('Bấm vào nút "Gửi lại OTP" để xác thực tài khoản.');
						emailRef.current = values.email;
					}
					if (isVerified) {
						toast.info(`Tài khoản với email: ${values.email} đã được xác thực. Vui lòng đăng nhập`);
					}
					isVerifiedRef.current = isVerified;
					return;
				}
				toast.error('Thất bại', {
					description: message
				});
			}
		} catch (_) {
			toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	}

	async function onResendOtp() {
		await sendVerification(emailRef.current);
		redirect('/verified');
	}

	return (
		<div className='grid lg:grid-cols-2 gap-12' style={{ width: 'min(70ch, 100vw - 2rem)' }}>
			<div className='lg:grid hidden place-content-center'>
				<Image src='/monetize.png' alt='monetize' width={200} height={200} />
			</div>
			<div>
				<div className='py-6'>
					<h2 className='text-2xl font-bold'>Tạo tài khoản</h2>
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
										<Input disabled={loading} placeholder='your.email@example.com' {...field} />
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
										<PasswordInput id='password' disabled={loading} placeholder='Mật khẩu của bạn' {...field} />
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
							Tạo tài khoản
						</Button>
						{isVerifiedRef.current === false && (
							<div className='flex mt-0'>
								<Button variant={'link'} onClick={onResendOtp} className='mt-0 px-0'>
									Gửi lại OTP
								</Button>
							</div>
						)}
					</form>
				</Form>
				<p className='text-xs py-6'>
					Chúng tôi coi trọng quyền riêng tư của bạn và sẽ không bao giờ gửi thông tin không liên quan.
				</p>
				<div>
					Bạn đã có tài khoản?{' '}
					<Link className='text-blue-500 hover:underline' href='/sign-in'>
						Đăng nhập
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Page;
