ALTER TABLE session ADD `id` text PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE INDEX `Account_userId_index` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_sessionToken_unique` ON `session` (`sessionToken`);--> statement-breakpoint
CREATE INDEX `Session_userId_index` ON `session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verificationToken_token_unique` ON `verificationToken` (`token`);