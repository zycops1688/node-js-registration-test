import type React from "react"
import { SidebarNav } from "@/components/sidebarNav"
import { Users, Settings, Home, BarChart3, FileText } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

const sidebarNavItems = [
    {
        title: "หน้าหลัก",
        href: "/",
        icon: <Home className="h-5 w-5" />,
    },
    {
        title: "ลงทะเบียน",
        href: "/register",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "รายงาน",
        href: "/reports",
        icon: <FileText className="h-5 w-5" />,
    },
    {
        title: "สถิติ",
        href: "/stats",
        icon: <BarChart3 className="h-5 w-5" />,
    },
    {
        title: "ผู้ดูแลระบบ",
        href: "/admin",
        icon: <Settings className="h-5 w-5" />,
    },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] py-8">
            <aside className="hidden md:block">
                <SidebarNav items={sidebarNavItems} />
            </aside>
            <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
        </div>
    )
}
