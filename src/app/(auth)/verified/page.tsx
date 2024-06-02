'use client';

import { sendVerification } from '@/app/actions/send-verification';
import { verifyOTP } from '@/app/actions/verify-otp';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useCountdown } from '@/hooks/useCountDown';
import { cn, formatCountDownTime } from '@/lib/utils';
import { useEmailStore } from '@/stores/emailStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const verifiedFormSchema = z.object({
	otp: z.string().min(6, {
		message: 'OTP của bạn phải có 6 ký tự.'
	})
});

const Page = () => {
	const [loading, setLoading] = useState(false);
	const { current, reset } = useCountdown(0, 5 * 60);
	const { email } = useEmailStore();
	const form = useForm<z.infer<typeof verifiedFormSchema>>({
		resolver: zodResolver(verifiedFormSchema),
		defaultValues: {
			otp: ''
		}
	});

	async function onSubmit(values: z.infer<typeof verifiedFormSchema>) {
		if (!email) {
			// NOTE: should not/don't expect it will run to this block
			toast.error('Không tìm thấy địa chỉ email');
			return;
		}
		setLoading(true);
		try {
			const { success, message } = await verifyOTP(values.otp, email);
			if (success) {
				toast.success('Thành công', { description: message });
				redirect('/sign-in');
			} else {
				toast.warning('Thất bại', { description: message });
			}
		} catch (_) {
			toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	}

	async function onResendOtp() {
		// reset timer
		reset();
		if (!email) {
			toast.error('Không tìm thấy địa chỉ email');
			return;
		}
		try {
			const { message, success } = await sendVerification(email);
			if (success) {
				toast.success('Thành công', { description: message });
			} else {
				toast.error('Thất bại', { description: message });
			}
		} catch (_) {
			toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
		}
	}

	return (
		<div className='grid lg:grid-cols-2 gap-12' style={{ width: 'min(70ch, 100vw - 2rem)' }}>
			<div className='lg:grid hidden place-content-center'>
				<Image src='/mail-sent.png' alt='mail-sent' width={200} height={200} />
			</div>
			<div>
				<div className='py-6'>
					<h2 className='text-2xl font-bold'>Xác thực email</h2>
					<p className='my-2 text-gray-600'>{`Mã xác thực đã được gửi tới địa chỉ ${email ?? 'email của bạn'}`}</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
						<FormField
							control={form.control}
							name='otp'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<InputOTP disabled={loading} maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex mt-0'>
							<Button
								variant={'link'}
								type='button'
								className={cn('px-0 text-blue-500', current !== '0' ? 'cursor-not-allowed' : '')}
								onClick={onResendOtp}
								disabled={loading}>
								Gửi lại OTP {current !== '0' && formatCountDownTime(Number(current))}
							</Button>
						</div>
						<Button disabled={loading} type='submit'>
							{loading && <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />}
							Xác thực
						</Button>
					</form>
				</Form>
				<p className='text-xs py-6'>
					Lưu ý: Nếu không nhận được mã xác thực, Bạn thử kiểm tra mục <b>Thư rác</b> hoặc <b>Spam</b> nha
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
