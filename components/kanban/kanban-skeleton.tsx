import { Skeleton } from "@/components/ui/skeleton";

export function KanbanSkeleton() {
    return (
        <div className="flex flex-col h-full p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-32" />
            </div>

            {/* Search Skeleton */}
            <Skeleton className="h-10 w-full max-w-md" />

            {/* Board Skeleton */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="min-w-[300px] rounded-lg border bg-muted/30 p-4 space-y-4">
                        {/* Column Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <Skeleton className="h-5 w-12" />
                        </div>

                        {/* Cards */}
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="rounded-lg border bg-card p-4 space-y-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
