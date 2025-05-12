import { RegistrationForm } from '@/components/registrationForm'
import { RegistrationTable } from '@/components/registrationTable'
import { RegistrationProvider } from '@/context/RegistrationContext'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <RegistrationProvider>
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-center mb-8">ระบบลงทะเบียนเข้างาน</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <RegistrationForm />
                        <RegistrationTable />
                    </div>
                </div>
            </main>
        </RegistrationProvider>
    )
}

export default page