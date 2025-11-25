"use strict";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter } from "lucide-react"

export function JobFilters() {
    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 font-semibold">
                <Filter className="h-4 w-4" />
                Filters
            </div>

            <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search jobs..." className="pl-8" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Location Type</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Job Type</Label>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="full-time" />
                        <label
                            htmlFor="full-time"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Full-time
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="part-time" />
                        <label
                            htmlFor="part-time"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Part-time
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="contract" />
                        <label
                            htmlFor="contract"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Contract
                        </label>
                    </div>
                </div>
            </div>

            <Button className="w-full mt-2">Apply Filters</Button>
        </div>
    )
}
