"use client"

import { useState } from "react"
import { MOCK_APPLICATIONS } from "@/lib/mock-data"
import { ApplicationsTable } from "@/components/applications/applications-table"
import { ApplicationsKanban } from "@/components/applications/applications-kanban"
import { ApplicationSheet } from "@/components/applications/application-sheet"
import { Application } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutList, Kanban } from "lucide-react"

export default function ApplicationsPage() {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    const handleSelectApplication = (app: Application) => {
        setSelectedApp(app)
        setSheetOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground">Manage and track candidate applications.</p>
                </div>
            </div>

            <Tabs defaultValue="list" className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <LayoutList className="h-4 w-4" />
                            List
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className="flex items-center gap-2">
                            <Kanban className="h-4 w-4" />
                            Kanban
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="list" className="flex-1">
                    <ApplicationsTable
                        applications={MOCK_APPLICATIONS}
                        onSelectApplication={handleSelectApplication}
                    />
                </TabsContent>
                <TabsContent value="kanban" className="flex-1 h-full">
                    <ApplicationsKanban
                        applications={MOCK_APPLICATIONS}
                        onSelectApplication={handleSelectApplication}
                    />
                </TabsContent>
            </Tabs>

            <ApplicationSheet
                application={selectedApp}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </div>
    )
}
