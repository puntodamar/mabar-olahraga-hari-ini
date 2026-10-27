"use client";

import { AdminTablePage } from "../admin-table-page";
import { getVenueColumns } from "./columns";
import VenueFormDialog from "./venue-form-dialog";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { AdminVenue } from "./columns";

export default function VenueManager() {
    const paginated = usePaginatedFetch<AdminVenue>({
        url: "/api/admin/venues",
        errorMessage: "Gagal memuat venue.",
    });

    return (
        <AdminTablePage
            {...paginated}
            onSearchChange={paginated.setSearch}
            columns={getVenueColumns}
            countLabel={(total) => `${total} venue`}
            searchLabel="Cari nama venue..."
            loadingLabel="Memuat venue..."
            addLabel="Tambah Venue"
            emptyMessage="Belum ada venue."
            dialog={({ open, onOpenChange, editing, onSaved }) => (
                <VenueFormDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    venue={editing}
                    onSaved={onSaved}
                />
            )}
        />
    );
}
