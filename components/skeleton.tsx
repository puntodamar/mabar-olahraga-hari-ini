import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonAvatar() {
    return (
        <div className="flex w-fit items-center gap-4">
            <Skeleton className="size-10 shrink-0 rounded-full bg-muted-foreground/20" />

            <div className="grid gap-2">
                <Skeleton className="h-4 w-[150px] bg-muted-foreground/20" />
                <Skeleton className="h-4 w-[100px] bg-muted-foreground/20" />
            </div>
        </div>
    )
}
