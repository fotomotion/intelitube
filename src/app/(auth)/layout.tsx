import { auth } from "@/lib/firebase/config";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session");
  
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto flex min-h-screen w-full flex-col justify-center py-12 md:py-24 lg:py-32">
        {children}
      </main>
    </div>
  );
}