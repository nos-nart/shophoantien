'use client';

import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export default function Home() {
	const [showBackToTop, setShowBackToTop] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 200) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	return (
		<div className='flex flex-col min-h-[100dvh]'>
			<header className='px-4 lg:px-6 h-14 flex items-center shadow-header'>
				<Link href='#' className='flex items-center justify-center' prefetch={false}>
					<Image src='/coin.png' alt='logo' width={30} height={30} />
					<span className='sr-only'>shophoantien</span>
				</Link>
				<nav className='ml-auto flex gap-4 sm:gap-6'>
					<Link href='/sign-in' className='text-sm font-medium hover:underline underline-offset-4' prefetch={false}>
						Đăng nhập
					</Link>
				</nav>
			</header>
			<main className='flex-1'>
				<section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
					<div className='container px-4 md:px-6'>
						<div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]'>
							<div className='flex flex-col justify-center space-y-4'>
								<div className='space-y-2'>
									<h1 className='text-3xl font-semibold tracking-tighter sm:text-5xl xl:text-6xl'>
										Kiếm tiền hoàn lại trên mỗi đơn hàng
									</h1>
									<p className='max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400'>
										Chương trình hoàn tiền của <b className='text-purple-500'>shophoantien</b> giúp bạn dễ dàng tiết
										kiệm tiền cho những thứ bạn mua hàng ngày. Nhận lại tới 10% khi mua hàng đủ điều kiện cho hàng ngàn
										mặt hàng.
									</p>
								</div>
								<div className='flex flex-col gap-2 min-[400px]:flex-row'>
									<Link
										href='#'
										className='inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300'
										prefetch={false}>
										Tham gia miễn phí
									</Link>
									<Link
										href='#'
										className='inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300'
										prefetch={false}>
										Tìm hiểu thêm
									</Link>
								</div>
							</div>
							<img
								src='/placeholder.svg'
								width='550'
								height='550'
								alt='Hero'
								className='mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last'
							/>
						</div>
					</div>
				</section>
				<section className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800'>
									shophoantien hoạt động như thế nào?
								</div>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
									Kiếm tiền hoàn lại trên mỗi đơn hàng
								</h2>
								<p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
									dummy text
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12'>
							<img
								src='/placeholder.svg'
								width='550'
								height='310'
								alt='Image'
								className='mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last'
							/>
							<div className='flex flex-col justify-center space-y-4'>
								<ul className='grid gap-6'>
									<li>
										<div className='grid gap-1'>
											<h3 className='text-xl font-bold'>Earn Cash Back at Thousands of Stores</h3>
											<p className='text-gray-500 dark:text-gray-400'>
												Rakuten partners with over 3,500 stores, including major retailers, online shops, and travel
												sites, to offer cash back on your purchases.
											</p>
										</div>
									</li>
									<li>
										<div className='grid gap-1'>
											<h3 className='text-xl font-bold'>Tỷ lệ hoàn tiền trung bình 3-5%</h3>
											<p className='text-gray-500 dark:text-gray-400'>
												Kiếm tới 10% tiền mặt khi mua hàng đủ điều kiện, với tỷ lệ trung bình là 3-5%.
											</p>
										</div>
									</li>
									<li>
										<div className='grid gap-1'>
											<h3 className='text-xl font-bold'>Dễ sử dụng</h3>
											<p className='text-gray-500 dark:text-gray-400'>
												Đăng ký chỉ sau vài phút, mua hàng và bắt đầu kiếm tiền hoàn lại ngay lập tức.
											</p>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='space-y-2'>
							<h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>Frequently Asked Questions</h2>
						</div>
						<div className='mt-8 space-y-4'>
							<Accordion type='single' collapsible={true}>
								<AccordionItem value='item-1'>
									<AccordionTrigger>Why does turning my device off and on again solve all issues?</AccordionTrigger>
									<AccordionContent>Because it clears the memory and starts the system from scratch.</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-2'>
									<AccordionTrigger>Are extra cables in the box bonus decorations?</AccordionTrigger>
									<AccordionContent>
										As tempting as it is to weave them into artistic sculptures, those cables are essential for
										connecting, charging, and beaming digital magic.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-3'>
									<AccordionTrigger>Can I wear my VR headset to my cousin&apos;s wedding?</AccordionTrigger>
									<AccordionContent>
										Yes but you might end up inadvertently dodging invisible dance partners or trying to high-five
										digital confetti.
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				</section>
				<section className='w-full py-12 md:py-24 lg:py-32 border-t'>
					<div className='container grid items-center justify-center gap-4 px-4 text-center md:px-6'>
						<div className='space-y-3'>
							<h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
								Bắt đầu kiếm tiền hoàn lại ngay hôm nay
							</h2>
							<p className='mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
								Tham gia ngay và bắt đầu tiết kiệm tiền khi mua hàng. Đăng ký miễn phí và bạn có thể bắt đầu kiếm tiền
								ngay lập tức.
							</p>
						</div>
						<div className='mx-auto w-full max-w-sm space-y-2'>
							<form className='flex space-x-2'>
								<Input type='email' placeholder='example@email.com' className='max-w-lg flex-1' />
								<Button type='submit'>Tham gia ngay</Button>
							</form>
							<p className='text-xs text-gray-500 dark:text-gray-400 flex justify-center gap-[1ch]'>
								Đăng kí ngày.
								<Link href='#' className='underline underline-offset-2' prefetch={false}>
									Điều khoản sử dụng
								</Link>
							</p>
						</div>
					</div>
				</section>
			</main>
			<footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
				<p className='text-xs text-gray-500 dark:text-gray-400'>&copy; 2024 shophoantien.</p>
				<nav className='sm:ml-auto flex gap-4 sm:gap-6'>
					<Link href='#' className='text-xs hover:underline underline-offset-4' prefetch={false}>
						Điều khoản sử dụng
					</Link>
					<Link href='#' className='text-xs hover:underline underline-offset-4' prefetch={false}>
						Chính sách bảo mật
					</Link>
				</nav>
			</footer>
			{showBackToTop && (
				<button
					type='button'
					className='fixed bottom-4 right-4 bg-gray-900 text-gray-50 rounded-full p-3 shadow hover:bg-gray-900/90 focus:outline-none focus:ring-1 focus:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300'
					onClick={scrollToTop}>
					<ArrowUp className='h-5 w-5' />
				</button>
			)}
		</div>
	);
}
