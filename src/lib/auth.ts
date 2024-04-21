import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import { env } from "@/lib/env.mjs";
import { ZodError } from "zod";
import { signInSchema } from "@/app/(auth)/sign-in/page";
import { User, users } from "./db/schema/auth";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: env.AUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        try {
          let user: User | null | undefined = null;
          const argon2id = new (await import("oslo/password")).Argon2id();
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          // logic to salt and hash password
          const pwHash = await argon2id.hash(password);
          // logic to verify if user exists
          user = (
            await db.select().from(users).where(eq(users.email, email))
          ).at(0);
          if (!user) {
            throw new Error("Không tìm thấy thông tin người dùng.");
          }
          const isMatchedPw = await argon2id.verify(pwHash, user?.password!);
          if (!isMatchedPw) {
            return null;
          }
          // return json object with the user data
          // FIXME: https://authjs.dev/getting-started/typescript
          return user as any;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
});
