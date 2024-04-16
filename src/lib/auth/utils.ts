import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { env } from "@/lib/env.mjs";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
});
