"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRegistration } from "../context/RegistrationContext"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Users,
    ChevronUp,
    ChevronDown,
    Settings,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    BarChart3,
    Calendar,
    Edit3,
} from "lucide-react"

export const AdminPanel = () => {
    const { eventConfig, registrations, updateEventSeats, error } = useRegistration()
    const [totalSeats, setTotalSeats] = useState(eventConfig?.totalSeats || 0)
    const [isEditing, setIsEditing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await updateEventSeats(totalSeats)
            setIsEditing(false)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSeatsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        const numValue = value ? parseInt(value) : 0
        if (numValue >= 0) {
            setTotalSeats(numValue)
        }
    }

    const remainingSeats = eventConfig ? eventConfig.totalSeats - registrations.length : 0
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold">จัดการระบบลงทะเบียน</CardTitle>
                            <CardDescription className="text-blue-100 mt-1">
                                ระบบจัดการการลงทะเบียนเข้างาน
                            </CardDescription>
                        </div>
                        <Settings className="h-6 w-6 text-white/80" />
                    </div>
                </CardHeader>

                <CardContent className="px-0 pt-0 px-4 mt-4">
                    {showSuccess && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <Alert className="bg-green-50 border-green-200 text-green-800">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription>บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Card className="border border-blue-100 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-medium text-blue-800 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                                    สถานะที่นั่ง
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">ที่นั่งทั้งหมด</span>
                                            <span className="font-semibold">{eventConfig?.totalSeats || 0} ที่นั่ง</span>
                                        </div>
                                        <Progress value={100} className="h-2" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">ที่นั่งคงเหลือ</span>
                                            <span className="font-semibold">{remainingSeats} ที่นั่ง</span>
                                        </div>
                                        <Progress
                                            value={(remainingSeats / (eventConfig?.totalSeats || 1)) * 100}
                                            className="h-2"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">ผู้ลงทะเบียนทั้งหมด</span>
                                            <span className="font-semibold">{registrations.length} คน</span>
                                        </div>
                                        <Progress
                                            value={(registrations.length / (eventConfig?.totalSeats || 1)) * 100}
                                            className="h-2 bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-medium flex items-center">
                                    <Edit3 className="h-5 w-5 mr-2 text-gray-600" />
                                    ตั้งค่าจำนวนที่นั่ง
                                </CardTitle>
                                <CardDescription>กำหนดจำนวนที่นั่งทั้งหมดสำหรับงาน</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="totalSeats">จำนวนที่นั่งทั้งหมด</Label>
                                            <Input
                                                type="text"
                                                id="totalSeats"
                                                value={totalSeats}
                                                onChange={handleSeatsChange}
                                                required
                                                className="max-w-xs"
                                                onWheel={(e) => e.currentTarget.blur()}
                                            />
                                            <p className="text-sm text-gray-500">หมายเหตุ: การเปลี่ยนแปลงจำนวนที่นั่งจะมีผลทันที</p>
                                        </div>

                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="flex space-x-2">
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                                <Save className="h-4 w-4 mr-2" />
                                                บันทึก
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    setTotalSeats(eventConfig?.totalSeats || 0)
                                                }}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                ยกเลิก
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="text-gray-600">
                                                จำนวนที่นั่งปัจจุบัน: <span className="font-bold text-lg">{eventConfig?.totalSeats || 0}</span> ที่นั่ง
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                อัปเดตล่าสุด: {new Date().toLocaleDateString("th-TH")}
                                            </p>
                                        </div>
                                        <Button onClick={() => setIsEditing(true)}>
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            แก้ไข
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>

                <CardFooter className="border-t px-6 py-4 text-sm text-gray-500">
                    ข้อมูลอัปเดตล่าสุด: {new Date().toLocaleString("th-TH")}
                </CardFooter>
            </Card>
        </motion.div>
    )
}
