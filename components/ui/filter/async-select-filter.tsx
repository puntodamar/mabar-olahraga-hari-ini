"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type AsyncSelectItem<T extends string | number> = {
    label: string
    value: T
}

type AsyncSelectFilterProps<T extends string | number> = {
    value?: T | null
    onValueChange?: (value: T | null, item?: AsyncSelectItem<T>) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    fetchItems: (search: string) => Promise<AsyncSelectItem<T>[]>
    initialItem?: AsyncSelectItem<T> | null
    disabled?: boolean
    className?: string
    loadOnOpen?: boolean
}

export default function AsyncSelectFilter<T extends string | number>({
    value,
    onValueChange,
    placeholder = "Pilih...",
    searchPlaceholder = "Cari...",
    emptyMessage = "Tidak ditemukan",
    fetchItems,
    initialItem,
    disabled,
    className,
    loadOnOpen = false,
}: AsyncSelectFilterProps<T>) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [items, setItems] = useState<AsyncSelectItem<T>[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState<AsyncSelectItem<T> | null>(
        initialItem ?? null
    )
    const lastFetchedRef = useRef("")

    const displayValue = useMemo(() => {
        if (selectedItem) return selectedItem.label
        if (value != null && items.length > 0) {
            const found = items.find((item) => item.value === value)
            if (found) return found.label
        }
        return placeholder
    }, [items, placeholder, selectedItem, value])

    const load = useCallback(
        async (query: string) => {
            setLoading(true)
            try {
                const result = await fetchItems(query)
                setItems(result)
                lastFetchedRef.current = query
            } catch (error) {
                console.error(error)
                setItems([])
            } finally {
                setLoading(false)
            }
        },
        [fetchItems]
    )

    useEffect(() => {
        if (!open) {
            setSearch("")
            setItems([])
            lastFetchedRef.current = ""
            return
        }

        if (!loadOnOpen && search === "") {
            setItems([])
            lastFetchedRef.current = ""
            return
        }

        const timer = setTimeout(() => {
            void load(search)
        }, 300)

        return () => clearTimeout(timer)
    }, [load, loadOnOpen, open, search])

    useEffect(() => {
        if (value == null) {
            setSelectedItem(null)
            return
        }
        if (selectedItem && selectedItem.value === value) return
        if (initialItem && initialItem.value === value) {
            setSelectedItem(initialItem)
            return
        }
    }, [initialItem, selectedItem, value])

    const handleSelect = useCallback(
        (item: AsyncSelectItem<T>) => {
            setSelectedItem(item)
            onValueChange?.(item.value, item)
            setOpen(false)
        },
        [onValueChange]
    )

    const handleClear = useCallback(() => {
        setSelectedItem(null)
        onValueChange?.(null)
        setOpen(false)
    }, [onValueChange])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between text-left font-normal",
                            value == null && !selectedItem && "text-muted-foreground",
                            className
                        )}
                    />
                }
            >
                <span className="min-w-0 flex-1 truncate">{displayValue}</span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[var(--anchor-width)] p-0" align="start">
                <div className="p-2">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={searchPlaceholder}
                        autoFocus
                        className="h-8"
                    />
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Memuat...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                            {emptyMessage}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {value != null && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent"
                                >
                                    Kosongkan
                                </button>
                            )}
                            {items.map((item) => (
                                <button
                                    type="button"
                                    key={String(item.value)}
                                    onClick={() => handleSelect(item)}
                                    className={cn(
                                        "px-2 py-1.5 text-left text-sm hover:bg-accent",
                                        value === item.value && "bg-accent"
                                    )}
                                >
                                    <span className="truncate">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
