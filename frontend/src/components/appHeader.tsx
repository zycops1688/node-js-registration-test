import { MainNav } from "./mainNav"

export function AppHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">ลท</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:inline-block">ระบบลงทะเบียนเข้างาน</span>
                    </div>
                    <div className="md:ml-6 md:block">
                        <MainNav />
                    </div>
                </div>
            </div>
        </header>
    )
}
