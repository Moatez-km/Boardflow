'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/auth-provider';
import DashboardNavbar from './dashboard-navbar';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <p className="p-8">Loading...</p>;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="p-8">
            <DashboardNavbar />
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2">Welcome, {user.name}</p>
        </main>
    );
}
