"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRegistration } from "../context/RegistrationContext"
import { CalendarDays, Users, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

interface FormData {
    firstName: string
    lastName: string
    phoneNumber: string
}

export const RegistrationForm = () => {
    const { registerEvent, eventConfig, registrations, error } = useRegistration()
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await registerEvent(formData)
            setFormData({ firstName: "", lastName: "", phoneNumber: "" })
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 3000)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const remainingSeats = eventConfig ? eventConfig.totalSeats - registrations.length : 0
    const percentFilled = eventConfig ? (registrations.length / eventConfig.totalSeats) * 100 : 0

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">ลงทะเบียนเข้างาน</CardTitle>
                    <CardDescription className="text-blue-100">ทดสอบเข้างาน</CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    {/* Event details */}
                    <div className="mb-6 space-y-2">
                        <div className="flex items-center text-gray-600">
                            <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{new Date().toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                            <span>
                                ผู้ลงทะเบียนทั้งหมด: <span className="font-bold">{registrations.length}</span> คน
                            </span>
                        </div>
                    </div>

                    {/* Seats progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">
                                ที่นั่งคงเหลือ: <span className="font-bold text-blue-600">{remainingSeats}</span> ที่นั่ง
                            </span>
                            <span className="text-gray-500">{percentFilled.toFixed(1)}% เต็ม</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                style={{ width: `${percentFilled}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Success message */}
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700"
                        >
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                            ลงทะเบียนสำเร็จ! ขอบคุณที่ลงทะเบียน
                        </motion.div>
                    )}

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700"
                        >
                            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                            {error}
                        </motion.div>
                    )}

                    {/* Registration form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">
                                ชื่อ
                            </Label>
                            <Input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="กรุณากรอกชื่อ"
                                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">
                                นามสกุล
                            </Label>
                            <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="กรุณากรอกนามสกุล"
                                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                เบอร์โทรศัพท์
                            </Label>
                            <Input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center pb-6">
                    <Button
                        type="submit"
                        onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)}
                        disabled={remainingSeats <= 0 || isSubmitting}
                        className={`w-full py-2 transition-all duration-300 ${remainingSeats <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            }`}
                    >
                        {isSubmitting ? "กำลังลงทะเบียน..." : remainingSeats <= 0 ? "ที่นั่งเต็มแล้ว" : "ลงทะเบียน"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
