import { Search, MapPinned, Navigation, Filter } from "lucide-react";

export default function Home() {
    return (
        <main className="flex h-screen overflow-hidden">
            <aside className="w-96 border-r bg-background">
                Sidebar
            </aside>

            <section className="flex flex-1 flex-col">
                <header className="border-b p-4">
                    <Search className="h-5 w-5" />
                    <Filter className="h-5 w-5" />
                </header>

                <div className="flex-1 bg-muted">
                    Map goes here
                </div>
            </section>
        </main>
    );
}