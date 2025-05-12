"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { useRegistration } from "../context/RegistrationContext"
import { Pagination } from "./pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Calendar,
    Phone,
    User,
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type SortOrder = "asc" | "desc"
type SortField = "firstName" | "lastName" | "registeredAt"

export const RegistrationTable = () => {
    const { registrations, totalPages, fetchRegistrations, loading, error } = useRegistration()
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState<SortField>("registeredAt")
    const [order, setOrder] = useState<SortOrder>("desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const pageSize = 10

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchRegistrations(search, sortBy, order, page, pageSize)
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRegistrations(search, sortBy, order, currentPage, pageSize)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [search, sortBy, order, currentPage, pageSize])

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setOrder(order === "asc" ? "desc" : "asc")
        } else {
            setSortBy(field)
            setOrder("asc")
        }
    }

    const getSortIcon = (field: SortField) => {
        if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
        return order === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setCurrentPage(1) // Reset to first page on new search
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchRegistrations(search, sortBy, order, currentPage, pageSize)
        setTimeout(() => setIsRefreshing(false), 500)
    }


    const getStatusBadge = (date: string) => {
        const registrationDate = new Date(date)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - registrationDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 1) {
            return <Badge className="bg-green-500 hover:bg-green-600">ใหม่</Badge>
        }
        return null
    }

    const formatPhoneNumber = (phone: string) => {
        if (!phone) return ""
        // Format as 0xx-xxx-xxxx if 10 digits
        if (phone.length === 10) {
            return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`
        }
        return phone
    }

    return (
        <Card className="w-full shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg pb-6">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">รายการลงทะเบียนทั้งหมด</CardTitle>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                            onClick={handleRefresh}
                            disabled={loading || isRefreshing}
                        >
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                                <RefreshCw className="h-4 w-4 mr-1" />
                            )}
                            รีเฟรช
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="ค้นหาชื่อหรือนามสกุล..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border-b border-red-100 flex items-center text-red-700">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center items-center py-12"
                            >
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
                                <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
                            </motion.div>
                        ) : (
                            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                className="w-[200px] cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("firstName")}
                                            >
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span>ชื่อ</span>
                                                    {getSortIcon("firstName")}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="w-[200px] cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("lastName")}
                                            >
                                                <div className="flex items-center">
                                                    <span>นามสกุล</span>
                                                    {getSortIcon("lastName")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="w-[150px]">
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span>เบอร์โทร</span>
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="w-[180px] cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleSort("registeredAt")}
                                            >
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span>วันที่ลงทะเบียน</span>
                                                    {getSortIcon("registeredAt")}
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {registrations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    ไม่พบข้อมูลการลงทะเบียน
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            registrations.map((registration, index) => (
                                                <TableRow key={registration._id || index} className="hover:bg-blue-50 transition-colors">
                                                    <TableCell className="font-medium">{registration.firstName}</TableCell>
                                                    <TableCell>{registration.lastName}</TableCell>
                                                    <TableCell>
                                                        <span className="font-mono">{formatPhoneNumber(registration.phoneNumber)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <span>
                                                                {new Date(registration.registeredAt).toLocaleDateString("th-TH", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                            {getStatusBadge(registration.registeredAt)}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-4 border-t">
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                </div>
            </CardContent>
        </Card>
    )
}
