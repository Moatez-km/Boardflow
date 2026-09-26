'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/src/lib/auth-api';

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            router.replace('/login');
            router.refresh();
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
            Logout
        </button>
    );
}
