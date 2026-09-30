import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/ui/admin-sidebar";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <AdminSidebar />

            <SidebarInset className="flex flex-col h-screen overflow-hidden bg-muted">
                <header className="flex shrink-0 items-center gap-2 px-4 z-40">
                    <SidebarTrigger className="p-3 bg-primary text-white size-10 hover:bg-primary hover:text-white hover:cursor-pointer lg:hidden" />
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Suspense fallback={null}>
                        {children}
                    </Suspense>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}