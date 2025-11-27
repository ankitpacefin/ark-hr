"use client";

import * as React from "react"
import {
    Briefcase,
    LayoutDashboard,
    Settings,
    Users,
    UserCog,
    PlusCircle,
    Command,
    GalleryVerticalEnd,
    AudioWaveform,
    Kanban,
    MessageSquare,
    Bookmark
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"

// Sample data
const data = {
    user: {
        name: "Ankit",
        email: "ankit@example.com",
        avatar: "https://github.com/shadcn.png",
    },
    teams: [
        {
            name: "Ark-Hr Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Jobs",
            url: "/jobs",
            icon: Briefcase,
        },
        {
            title: "Applications",
            url: "/applications",
            icon: Users,
        },
        {
            title: "Users",
            url: "/users",
            icon: UserCog,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
        {
            title: "Comments",
            url: "/comments",
            icon: MessageSquare,
        },
        {
            title: "Saved",
            url: "/saved",
            icon: Bookmark,
        },
    ],
    navViews: [
        {
            title: "Kanban View",
            url: "/kanban",
            icon: Kanban,
        },
    ],
}

export function AppSidebar({ workspaces, ...props }: React.ComponentProps<typeof Sidebar> & { workspaces?: any[] }) {
    const pathname = usePathname()

    // Map workspaces to teams format
    const teams = workspaces?.map(ws => ({
        name: ws.name,
        logo: GalleryVerticalEnd, // Default logo for now
        plan: "Enterprise", // Default plan for now
        id: ws.id
    })) || data.teams;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex flex-col gap-0.5 px-2 py-2 group-data-[collapsible=icon]:hidden">
                    <span className="font-bold text-lg tracking-tight">Ark-hr</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">by Pocketful</span>
                </div>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator className="mx-2 my-2" />

                <SidebarGroup>
                    <SidebarGroupLabel>Views</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navViews.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator className="mx-2 my-2" />

                <SidebarGroup>
                    <SidebarGroupLabel>Actions</SidebarGroupLabel>
                    <SidebarMenu>
                        {/* Removed Post a Job as requested */}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
