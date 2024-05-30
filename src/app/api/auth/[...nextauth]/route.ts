import { handlers } from '@/lib/auth';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: DefaultSession['user'] & {
			id: string;
		};
	}
}

export const { GET, POST } = handlers;
