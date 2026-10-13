"use client";

import { AdminTablePage } from "../admin-table-page";
import { getCommunityColumns } from "./columns";
import CommunityFormDialog from "./community-form-dialog";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { AdminCommunity } from "@/src/types/AdminCommunity";

export default function CommunityManager() {
    const paginated = usePaginatedFetch<AdminCommunity>({
        url: "/api/admin/communities",
        errorMessage: "Gagal memuat komunitas.",
    });

    return (
        <AdminTablePage
            {...paginated}
            columns={getCommunityColumns}
            countLabel={(total) => `${total} komunitas`}
            loadingLabel="Memuat komunitas..."
            addLabel="Tambah Komunitas"
            emptyMessage="Belum ada komunitas."
            dialog={({ open, onOpenChange, editing, onSaved }) => (
                <CommunityFormDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    community={editing}
                    onSaved={onSaved}
                />
            )}
        />
    );
}