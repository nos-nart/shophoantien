import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { env } from "@/lib/env.mjs";
import { users } from "./db/schema/auth";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import * as argon2 from "argon2";

export class AccountNoVerified extends CredentialsSignin {
  code = "account-no-verified";
}

export class MissingCredentialsError extends CredentialsSignin {
  code = "missing-credentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: env.AUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) {
          throw new MissingCredentialsError("Thiếu thông tin xác thực");
        }
        let user = null;
        // logic to verify if user exists
        user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .get();
        if (!user) {
          throw new Error("Không tìm thấy thông tin người dùng.");
        }
        if (!user.emailVerified) {
          throw new AccountNoVerified("Tài khoản chưa được xác thực.");
        }
        const isMatchedPw = await argon2.verify(
          user?.password!,
          credentials.password as string
        );
        if (!isMatchedPw) {
          return null;
        }
        // return json object with the user data
        // FIXME: https://authjs.dev/getting-started/typescript
        return user as any;
      },
    }),
  ],
});
