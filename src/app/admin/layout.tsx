import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="section-container pt-16 pb-24">
        <div className="mb-10 flex items-end justify-between border-b border-brand-muted/20 pb-6">
          <Link
            href="/admin"
            className="font-oswald uppercase font-light text-brand-gold text-[22px] tracking-[0.2em] hover:opacity-70 transition-opacity"
          >
            Admin
          </Link>
          <span className="font-manrope text-[13px] text-brand-muted">
            {admin.email}
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}
