"use client";
import { z } from "zod"
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const formSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ'}),
	password: z.string().regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/), {
		message:
			'Mật khẩu phải có tối thiểu 8 ký tự và chứa ít nhất một chữ hoa, chữ thường, số và một ký tự đặc biệt',
	}),
})

const Page = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await signIn('credentials', {
			callbackUrl: '/',
			email: values.email,
			password: values.password,
			redirect: false
		});
		console.log(response)
	}

	return (
		<div className="grid lg:grid-cols-2 gap-12" style={{ width: 'min(60ch, 100vw - 2rem)' }}>
			<div className="lg:grid hidden place-content-center">
				<Image src="/say-hi.png" alt="test" width={200} height={200} />
			</div>
			<div>
				<div className="py-6">
					<h2 className="text-2xl font-bold">Đăng nhập</h2>
					<p className="my-2 text-gray-600">
						Mua hàng hoàn tiền lên đến 80%
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="your.email@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="password" placeholder="Mật khẩu của bạn" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit">Đăng nhập</Button>
					</form>
				</Form>
				<div className="mt-2">
					<Link className="text-blue-500 hover:underline" href="/forgot-password">Quên mật khẩu?</Link>
					<div className="mt-6">
						Bạn chưa có tài khoản?{' '}
						<Link className="text-blue-500 hover:underline" href="/sign-up">
							Đăng kí
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
