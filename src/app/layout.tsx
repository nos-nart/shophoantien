import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { siteConfig } from '@/config/site';
import { Toaster } from 'sonner';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans'
});

export const metadata: Metadata = {
	metadataBase: new URL('https://shophoantien.vercel.app'),
	title: {
		default: 'Shop hoàn tiền',
		template: '%s | Shop hoàn tiền'
	},
	description: 'Mua hàng hoàn tiền lên tới 80%',
	openGraph: {
		type: 'website',
		locale: 'vi_VN',
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: '/og.jpg',
				width: 1200,
				height: 630,
				alt: siteConfig.name
			}
		]
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png'
	},
	manifest: '/site.webmanifest'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem={true} disableTransitionOnChange={true}>
					{children}
				</ThemeProvider>
				<Toaster position='top-right' richColors={true} duration={30000} />
			</body>
		</html>
	);
}
