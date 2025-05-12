'use client';

import { RegistrationProvider } from '../../context/RegistrationContext';
import { AdminPanel } from '../../components/adminPanel';
import { RegistrationTable } from '../../components/registrationTable';

export default function AdminPage() {
    return (
        <RegistrationProvider>
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-center mb-8">จัดการระบบลงทะเบียน</h1>
                    <div className="space-y-8">
                        <AdminPanel />
                        <RegistrationTable />
                    </div>
                </div>
            </main>
        </RegistrationProvider>
    );
} 