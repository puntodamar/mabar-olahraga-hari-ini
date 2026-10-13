"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../schedules/data-table";
import { getCommunityColumns } from "./columns";
import CommunityFormDialog from "./community-form-dialog";
import { AdminCommunity } from "@/src/types/AdminCommunity";

export default function CommunityManager() {
    const [communities, setCommunities] = useState<AdminCommunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<AdminCommunity | null>(null);

    const loadCommunities = useCallback(() => {
        fetch("/api/admin/communities")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load communities");
                }
                return response.json();
            })
            .then((data) => {
                setCommunities(data);
                setError("");
            })
            .catch((e) => {
                console.error(e);
                setError("Gagal memuat komunitas.");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        void loadCommunities();
    }, [loadCommunities]);

    const handleAdd = useCallback(() => {
        setEditing(null);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((community: AdminCommunity) => {
        setEditing(community);
        setDialogOpen(true);
    }, []);

    const columns = useMemo(() => getCommunityColumns(handleEdit), [handleEdit]);

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    {loading ? "Memuat komunitas..." : `${communities.length} komunitas`}
                </p>
                <Button onClick={handleAdd} className="text-white">
                    <PlusIcon />
                    <span>Tambah Komunitas</span>
                </Button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                        Memuat komunitas...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={communities}
                        emptyMessage="Belum ada komunitas."
                    />
                )}
            </div>

            <CommunityFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                community={editing}
                onSaved={loadCommunities}
            />
        </div>
    );
}
