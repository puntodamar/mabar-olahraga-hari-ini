import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {ThemeModeToggle} from "@/components/ui/theme/theme-mode-toggle";


export default function Home() {
    return (
        <SidebarProvider>
            <AppSidebar  />
            <main className="flex w-full h-screen overflow-hidden">
                <div className="relative flex flex-1 flex-col">
                    <SidebarTrigger className="absolute top-2 z-50 lg:hidden" />
                    <div className="flex-1 bg-muted">
                    </div>

                    <div className="absolute bottom-2 right-2 lg:top-2 lg:left-2">
                        <ThemeModeToggle />
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}