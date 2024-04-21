import { DefaultSession } from "next-auth";
import { handlers } from "@/lib/auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const { GET, POST } = handlers;
