"use client"

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "../schedules/data-table-features";
import { AdminCommunity } from "@/src/types/AdminCommunity";
import { cn } from "@/lib/utils";
import { ArrowUpDown, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<DataTableFeatures, AdminCommunity>()

const className = "font-bold text-white text-md";

export function getCommunityColumns(onEdit: (community: AdminCommunity) => void) {
    return columnHelper.columns([
        columnHelper.accessor("name", {
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="text-white font-bold hover:bg-primary/80 hover:text-white">
                            Komunitas
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        }),

        columnHelper.accessor("community_types.name", {
            header: () => <div className={className}>Tipe</div>,
            cell: ({ row }) => (
                <span>{row.original.community_types?.name ?? "-"}</span>
            )
        }),

        columnHelper.accessor("community_contacts.whatsapp", {
            header: () => <div className={className}>WhatsApp</div>,
            cell: ({ row }) => (
                <span>{row.original.community_contacts?.whatsapp ?? "-"}</span>
            )
        }),

        columnHelper.accessor("community_contacts.instagram", {
            header: () => <div className={className}>Instagram</div>,
            cell: ({ row }) => (
                <span>{row.original.community_contacts?.instagram ?? "-"}</span>
            )
        }),

        columnHelper.accessor("community_contacts.tiktok", {
            header: () => <div className={className}>TikTok</div>,
            cell: ({ row }) => (
                <span>{row.original.community_contacts?.tiktok ?? "-"}</span>
            )
        }),

        columnHelper.display({
            id: "actions",
            header: () => <div className={cn(className, "text-center")}>Aksi</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => onEdit(row.original)}
                        >
                            <PencilIcon />
                            <span className="sr-only">Ubah</span>
                        </Button>
                    </div>
                )
            }
        }),
    ]);
}
