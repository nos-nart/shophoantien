import NextAuthProvider from "@/lib/auth/Provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <NextAuthProvider>
        <div className="flex h-screen">
          <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </NextAuthProvider>
    </main>
  );
}
