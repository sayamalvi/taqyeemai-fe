import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col w-full min-h-screen overflow-x-hidden pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
