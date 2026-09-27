"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./data-table-features"
import {DBScheduleList} from "@/src/types/DBScheduleList";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, DBScheduleList>()

export const columns = columnHelper.columns([

    columnHelper.accessor("community.name", {
        header: "Komunitas",
    }),

    columnHelper.accessor("day", {
        header: "Hari",
    }),

    columnHelper.accessor("time_start", {
        header: "Waktu Mulai",
    }),

    columnHelper.accessor("time_end", {
        header: "Waktu Selesai",
    }),

    columnHelper.accessor("level", {
        header: "Level",
    }),

    columnHelper.accessor("courts", {
        header: "Jumlah Lapangan",
    }),

    columnHelper.accessor("fee", {
        header: "Biaya",
    }),

    columnHelper.accessor("place.name", {
        header: "Lokasi",
    }),

    columnHelper.accessor("gender", {
        header: "Gender",
    }),
])