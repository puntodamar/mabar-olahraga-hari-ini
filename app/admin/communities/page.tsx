import CommunityManager from "./community-manager";

export default function KomunitasPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-4 md:p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Komunitas</h1>

            <div className="flex-1 overflow-hidden">
                <CommunityManager />
            </div>
        </div>
    );
}
