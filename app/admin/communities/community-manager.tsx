"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../schedules/data-table";
import { getCommunityColumns } from "./columns";
import CommunityFormDialog from "./community-form-dialog";
import { AdminCommunity } from "@/src/types/AdminCommunity";

export default function CommunityManager() {
    const [communities, setCommunities] = useState<AdminCommunity[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<AdminCommunity | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
    const totalRef = useRef(0);

    const handlePaginationChange = useCallback((updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
        setPagination(updater);
    }, []);

    const loadCommunities = useCallback(() => {
        const size = pagination.pageSize;
        let page = pagination.pageIndex;
        if (Number.isFinite(size) && totalRef.current > 0) {
            page = Math.min(page, Math.max(0, Math.ceil(totalRef.current / size) - 1));
        }
        const params = new URLSearchParams();
        if (Number.isFinite(size)) {
            params.set("page", String(page));
            params.set("pageSize", String(size));
        }
        const query = params.toString();

        Promise.resolve()
            .then(() => setRefreshing(true))
            .then(() => fetch(`/api/admin/communities${query ? `?${query}` : ""}`))
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load communities");
                }
                return response.json();
            })
            .then((data) => {
                totalRef.current = data.total;
                setCommunities(data.data);
                setTotal(data.total);
                setError("");
                if (page !== pagination.pageIndex) {
                    setPagination((old) => (old.pageIndex === page ? old : { ...old, pageIndex: page }));
                }
            })
            .catch((e) => {
                console.error(e);
                setError("Gagal memuat komunitas.");
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, [pagination]);

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
                    {!loading && `${total} komunitas`}
                </p>
                {!loading && (
                    <Button onClick={handleAdd} className="text-white">
                        <PlusIcon />
                        <span>Tambah Komunitas</span>
                    </Button>
                )}
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
                        rowCount={total}
                        pagination={pagination}
                        onPaginationChange={handlePaginationChange}
                        loading={refreshing}
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