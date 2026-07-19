import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import MapView from "@/components/map/map-view";
import {SearchIcon} from "lucide-react";
import {ThemeModeToggle} from "@/components/ui/theme/theme-mode-toggle";


export default function Home() {
    return (
        <SidebarProvider>
            <AppSidebar  />
            <main className="flex w-full h-screen overflow-hidden">
                <div className="relative flex flex-1 flex-col">
                    <SidebarTrigger className="absolute top-2 z-50 lg:hidden" >
                        <SearchIcon />
                    </SidebarTrigger>
                    <div className="flex-1 bg-muted">
                        {/*<MapView />*/}
                    </div>

                    <div className="absolute top-2 right-2">
                        <ThemeModeToggle />
                    </div>
                </div>
            </main>
        </SidebarProvider>

        // <main className="flex h-screen overflow-hidden">
        //     <MapSidebar />
        //
        //     <section className="flex flex-1 flex-col">
        //
        //         <div className="flex-1 bg-muted">
        //             {/*<MapView />*/}
        //             <div className="w-full h-full bg-muted"></div>
        //         </div>
        //     </section>
        // </main>
    );
}