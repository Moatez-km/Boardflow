"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    KanbanSquare,
    Settings,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from '@/src/components/auth-provider';
import LogoutButton from "@/app/(auth)/logout-button";

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Boards",
        href: "/boards",
        icon: KanbanSquare,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-md bg-white p-2 shadow md:hidden"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-white px-4 py-5 transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="mb-8 flex items-center justify-between px-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                            B
                        </div>

                        <span className="text-lg font-bold text-slate-800">
                            BoardFlow
                        </span>
                    </Link>

                    <button
                        onClick={() => setOpen(false)}
                        className="md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive
                                    ? "bg-blue-50 font-medium text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="mt-auto border-t pt-4">
                    <div className="mb-4 flex items-center gap-3 px-2">


                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                                {user?.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <LogoutButton />
                </div>
            </aside>
        </>
    );
}
