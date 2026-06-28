import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="min-h-screen w-full flex items-stretch">
        <div className="bg-[url('/img/bg-auth.png')] bg-cover bg-center bg-no-repeat flex-2 hidden lg:block"></div>
        <div className="flex-1 flex items-center justify-center shadow-2xl px-4 py-8 relative">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
