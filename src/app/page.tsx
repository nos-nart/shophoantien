import { LogIn } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 shadow-header">
        <nav
          className="_container flex justify-between items-center h-16"
          style={{ "--max-width": "90ch" }}
        >
          <span>Shophoantien</span>
          <Link
            href="/sign-in"
            className="flex gap-x-2 items-center hover:underline-offset-2 hover:underline"
          >
            <LogIn size={"18"} /> Đăng nhập
          </Link>
        </nav>
      </header>
    </main>
  );
}
