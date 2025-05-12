"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, Home, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function MainNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const routes = [
        {
            name: "ลงทะเบียน",
            path: "/",
            icon: <Home className="h-5 w-5" />,
        },
        {
            name: "ผู้ดูแลระบบ",
            path: "/admin",
            icon: <Settings className="h-5 w-5" />,
        },
    ]

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex">
                <nav className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-gray-100">
                    {routes.map((route) => {
                        const isActive = pathname === route.path
                        return (
                            <Link
                                key={route.path}
                                href={route.path}
                                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    {route.icon}
                                    <span>{route.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-full bg-blue-50 rounded-md -z-10"
                                        layoutId="navbar-indicator"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">เปิดเมนู</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                        <nav className="flex flex-col gap-4 mt-8">
                            {routes.map((route) => {
                                const isActive = pathname === route.path
                                return (
                                    <Link
                                        key={route.path}
                                        href={route.path}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                                            }`}
                                    >
                                        {route.icon}
                                        <span>{route.name}</span>
                                        {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                                    </Link>
                                )
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
