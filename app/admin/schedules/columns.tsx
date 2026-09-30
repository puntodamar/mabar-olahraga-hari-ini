"use client"

import { createColumnHelper } from "@tanstack/react-table";
import { Day } from "@/src/types/enums/Day";
import {Level} from "@/src/types/enums/Level";
import {Gender} from "@/src/types/enums/Gender";
import { type DataTableFeatures } from "./data-table-features";
import {DBScheduleList} from "@/src/types/DBScheduleList";
import {cn} from "cn";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, DBScheduleList>()

const className = "font-bold text-white text-md";

export const columns = columnHelper.columns([

    columnHelper.accessor("community.name", {
        // header: "Komunitas",
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
        id: "time_range", // Unique ID for the combined column
        header: () => {
            return (
                <div className={cn(className, "text-center")}>
                    Waktu
                </div>
            )
        },
        cell: ({ row }) => {
            const startTime = row.original.time_start;
            const endTime = row.original.time_end;

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
            const levelIndex = row.getValue("level") as number;
            const levelName = Level[levelIndex] || "";

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
        cell:({row}) => {
            return (
                <div className="text-center">{row.getValue("courts")}</div>
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
            const feeValue = row.getValue("fee") as number;

            return (
                <div className="text-center">{feeValue ? `${feeValue}K` : ""}</div>
            );
        }
    }),

    columnHelper.accessor("place.name", {
        header: ({ column }) => {
            return (
                <div className={className}>
                    Lokasi
                </div>
            )
        }
    }),

    columnHelper.accessor("gender", {
        header: ({ column }) => {
            return (
                <div className={cn(className, "text-center")}>
                    Gender
                </div>
            )
        },
        cell: ({ row }) => {
            const genderValue = row.getValue("gender") as number;
            const genderLabel = Gender[genderValue];
            return (
                <div className="text-center">{genderLabel}</div>
            );
        }
    }),


])