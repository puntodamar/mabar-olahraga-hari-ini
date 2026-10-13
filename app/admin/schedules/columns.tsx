"use client"

import { createColumnHelper } from "@tanstack/react-table";
import { Day } from "@/src/types/enums/Day";
import { Level } from "@/src/types/enums/Level";
import { Gender } from "@/src/types/enums/Gender";
import { type DataTableFeatures } from "./data-table-features";
import { AdminSchedule } from "@/src/types/AdminSchedule";
import { cn } from "@/lib/utils";
import { ArrowUpDown, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<DataTableFeatures, AdminSchedule>()

const className = "font-bold text-white text-md";

export function getScheduleColumns(onEdit: (schedule: AdminSchedule) => void) {
    return columnHelper.columns([
        columnHelper.accessor("community.name", {
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

        columnHelper.accessor("day", {
            header: () => <div className={className}>Hari</div>,
            cell: ({ row }) => {
                const dayIndex = row.getValue("day") as number;
                const dayName = Day[dayIndex - 1] || "Unknown";

                return (
                    <span>{dayName}</span>
                );
            }
        }),

        columnHelper.display({
            id: "time_range",
            header: () => {
                return (
                    <div className={cn(className, "text-center")}>
                        Waktu
                    </div>
                )
            },
            cell: ({ row }) => {
                const startTime = row.original.time_start.slice(0, 5);
                const endTime = row.original.time_end.slice(0, 5);

                return (
                    <div className="text-center">{startTime} - {endTime}</div>
                )
            }
        }),

        columnHelper.accessor("level", {
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="text-white font-bold hover:bg-primary/80 hover:text-white">
                            Level
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const levelIndex = row.getValue("level") as number | null;
                const levelName = levelIndex == null ? "-" : Level[levelIndex] || "";

                return (
                    <div className="text-center">{levelName}</div>
                );
            }
        }),

        columnHelper.accessor("courts", {
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="text-white font-bold hover:bg-primary/80 hover:text-white">
                            Lapangan
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="text-center">{row.getValue("courts") ?? "-"}</div>
                )
            }
        }),

        columnHelper.accessor("fee", {
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="text-white font-bold hover:bg-primary/80 hover:text-white">
                            Biaya
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const feeValue = row.getValue("fee") as number | null;

                return (
                    <div className="text-center">{feeValue ? `${feeValue}K` : ""}</div>
                );
            }
        }),

        columnHelper.accessor("place.name", {
            header: () => {
                return (
                    <div className={className}>
                        Lokasi
                    </div>
                )
            }
        }),

        columnHelper.accessor("gender", {
            header: () => {
                return (
                    <div className={cn(className, "text-center")}>
                        Gender
                    </div>
                )
            },
            cell: ({ row }) => {
                const genderValue = row.getValue("gender") as number | null;
                const genderLabel = genderValue == null ? "-" : Gender[genderValue];
                return (
                    <div className="text-center">{genderLabel}</div>
                );
            }
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
