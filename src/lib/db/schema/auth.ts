import { randomUUID } from 'node:crypto';
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user' as string, {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	name: text('name'),
	email: text('email').notNull().unique(),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image'),
	password: text('password')
});

export const accounts = sqliteTable(
	'account' as string,
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		userIdIdx: index('Account_userId_index').on(account.userId),
		compositePk: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const sessions = sqliteTable(
	'session' as string,
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		sessionToken: text('sessionToken').notNull().unique(),
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
	},
	(table) => ({
		userIdIdx: index('Session_userId_index').on(table.userId)
	})
);

export const verificationTokens = sqliteTable(
	'verificationToken' as string,
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull().unique(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
		type: text('type').$type<'verify-account' | 'reset-password'>().notNull()
	},
	(vt) => ({
		compositePk: primaryKey({ columns: [vt.identifier, vt.token] })
	})
);
