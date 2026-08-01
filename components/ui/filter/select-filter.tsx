import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


type Item<T extends string | number> = {
    label: string;
    value: T | null;
};

type SelectFilterProps<T extends string | number> = {
    items: Item<T>[];
    value?: T | null;
    onValueChange?: (value: T | null) => void;
    placeholder?: string;
    defaultValue?: Item<T> | null;
};

export default function SelectFilter<T extends string | number>({items, value, onValueChange, placeholder = "Select an option", defaultValue}: SelectFilterProps<T>) {
    return (
        <Select items={items} value={value} onValueChange={onValueChange} defaultValue={defaultValue?.value ?? null}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {items.map((item) => (
                        <SelectItem
                            key={String(item.value)}
                            value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}