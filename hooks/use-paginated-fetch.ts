"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

interface PaginatedResponse<T> {
    data: T[]
    total: number
}

interface UsePaginatedFetchOptions {
    url: string
    errorMessage: string
    /** Extra query string, e.g. "day=1&level=2", without the leading "?" */
    filtersQuery?: string
}

export function usePaginatedFetch<T>({
    url,
    errorMessage,
    filtersQuery,
}: UsePaginatedFetchOptions) {
    const [rows, setRows] = useState<T[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState("")
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const totalRef = useRef(0)
    const lastSearchRef = useRef("")
    const lastFiltersRef = useRef("")

    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(search), 300)
        return () => clearTimeout(handle)
    }, [search])

    const onPaginationChange = useCallback((updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
        setPagination(updater)
    }, [])

    const reload = useCallback(() => {
        const size = pagination.pageSize
        let page = pagination.pageIndex
        const searchChanged = lastSearchRef.current !== debouncedSearch
        const filtersChanged = lastFiltersRef.current !== filtersQuery
        if (searchChanged || filtersChanged) {
            page = 0
        } else if (Number.isFinite(size) && totalRef.current > 0) {
            page = Math.min(page, Math.max(0, Math.ceil(totalRef.current / size) - 1))
        }
        lastSearchRef.current = debouncedSearch
        lastFiltersRef.current = filtersQuery ?? ""

        const params = new URLSearchParams()
        if (Number.isFinite(size)) {
            params.set("page", String(page))
            params.set("pageSize", String(size))
        }
        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        }
        const query = [params.toString(), filtersQuery].filter(Boolean).join("&")

        Promise.resolve()
            .then(() => setRefreshing(true))
            .then(() => fetch(`${url}${query ? `?${query}` : ""}`))
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load data")
                }
                return response.json()
            })
            .then((data: PaginatedResponse<T>) => {
                totalRef.current = data.total
                setRows(data.data)
                setTotal(data.total)
                setError("")
                if (page !== pagination.pageIndex) {
                    setPagination((old) => (old.pageIndex === page ? old : { ...old, pageIndex: page }))
                }
            })
            .catch((e) => {
                console.error(e)
                setError(errorMessage)
            })
            .finally(() => {
                setLoading(false)
                setRefreshing(false)
            })
    }, [pagination, url, errorMessage, debouncedSearch, filtersQuery])

    useEffect(() => {
        void reload()
    }, [reload])

    return { rows, total, loading, refreshing, error, pagination, onPaginationChange, search, setSearch, reload }
}