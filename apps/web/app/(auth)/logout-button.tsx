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
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
            Logout
        </button>
    );
}
