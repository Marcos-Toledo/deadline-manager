import Image from "next/image";
import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="min-h-screen w-full flex items-stretch">
        <div className="flex-2 hidden lg:block relative">
          <Image
            src="/img/bg-auth.png"
            alt="Background"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex items-center justify-center shadow-2xl px-4 py-8 relative">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
