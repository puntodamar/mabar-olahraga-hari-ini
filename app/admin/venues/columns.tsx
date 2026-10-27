"use client"

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "../schedules/data-table-features";
import { ArrowUpDown, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AdminVenue {
    id: number;
    name: string;
    address?: string | null;
    map_url?: string | null;
}

const columnHelper = createColumnHelper<DataTableFeatures, AdminVenue>()

const className = "font-bold text-white text-md";

export function getVenueColumns(onEdit: (venue: AdminVenue) => void) {
    return columnHelper.columns([
        columnHelper.accessor("name", {
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="text-white font-bold hover:bg-primary/80 hover:text-white">
                            Nama Venue
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        }),

        columnHelper.accessor("address", {
            header: () => <div className={className}>Alamat</div>,
            cell: ({ row }) => (
                <span className="line-clamp-2">{row.original.address ?? "-"}</span>
            )
        }),

        columnHelper.accessor("map_url", {
            header: () => <div className={className}>Map</div>,
            cell: ({ row }) => (
                row.original.map_url ? (
                    <a href={row.original.map_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Lihat
                    </a>
                ) : <span>-</span>
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
