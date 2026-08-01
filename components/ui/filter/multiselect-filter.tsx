"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type Item = {
    label: string;
    value: string;
};

type MultiSelectProps = {
    items: Item[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
};

export function MultiSelect({
                                items,
                                value,
                                onValueChange,
                                placeholder = "Select",
                            }: MultiSelectProps) {
    const toggle = (item: string) => {
        if (value.includes(item)) {
            onValueChange(value.filter((v) => v !== item));
        } else {
            onValueChange([...value, item]);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="outline"
                    className="w-full justify-between"
                >
                    {value.length === 0
                        ? placeholder
                        : `${value.length} selected`}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                {items.map((item) => (
                    <DropdownMenuCheckboxItem
                        key={item.value}
                        checked={value.includes(item.value)}
                        onCheckedChange={() => toggle(item.value)}
                    >
                        {item.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}