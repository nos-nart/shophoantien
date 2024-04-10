import Link from 'next/link';
import { Home } from 'lucide-react';
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth/utils';

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (session?.session) redirect("/");

	return (
		<div className="bg-pattern flex h-screen w-screen flex-col items-center justify-center">
			<Link
				href="/"
				className="absolute left-4 top-4 rounded-lg border border-transparent bg-transparent px-3 py-2 text-center text-sm font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-slate-200 md:left-8 md:top-8"
			>
				<span className="flex items-center gap-[1ch]">
					<Home size={20} />
					Trang chủ
				</span>
			</Link>
			<>
				{children}
			</>
		</div>
	);
}
