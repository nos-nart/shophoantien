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
          <div className="flex items-center gap-x-2">
            <Image src="/coin.png" alt="logo" width={30} height={30} />
            <span>Shophoantien</span>
          </div>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Đăng nhập
          </Link>
        </nav>
      </header>
    </main>
  );
}
