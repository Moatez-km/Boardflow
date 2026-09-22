
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/auth-provider';
import DashboardNavbar from './dashboard-navbar';
import { BoardCard } from '../boards/[boardId]/boardCard';

type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    updatedAt: string;
};

export default function DashboardPage({
    initialBoards,
}: {
    initialBoards: Board[];
}) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [boardsLoading, setBoardsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleBoardDeleted = (deletedBoardId: string) => {
        setBoards((previousBoards) =>
            previousBoards.filter(
                (board) => board.id !== deletedBoardId
            )
        );
    };
    // Redirect if user is not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [isLoading, user, router]);

    // Fetch boards after user is authenticated
    useEffect(() => {
        if (!user) return;

        const loadBoards = async () => {
            try {
                setBoardsLoading(true);
                setError(null);

                const response = await fetch(
                    'http://localhost:3001/api/boards',
                    {
                        credentials: 'include',
                    }
                );

                const data = await response.json();

                console.log('Boards response:', data);

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        `Failed to fetch boards (${response.status})`
                    );
                }

                setBoards(data);
            } catch (error) {
                console.error('Failed to load boards:', error);

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load boards.'
                );
            } finally {
                setBoardsLoading(false);
            }
        };

        loadBoards();
    }, [user]);

    if (isLoading) {
        return <p className="p-8">Loading...</p>;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="p-8">
            <DashboardNavbar />

            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>

            <p className="mt-2">
                Welcome, {user.name}
            </p>

            <section className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold"> Your Boards </h2>
                    <button type="button" onClick={() => router.push('/boards/newBoard')} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700" > + Create Board </button>
                </div>

                {boardsLoading && (
                    <p className="text-gray-500">
                        Loading boards...
                    </p>
                )}

                {error && (
                    <p className="text-red-500">
                        {error}
                    </p>
                )}

                {!boardsLoading && !error && boards.length === 0 && (
                    <p className="text-gray-500">
                        You don't have any boards yet.
                    </p>
                )}

                {!boardsLoading && !error && boards.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {boards.map((board) => (
                            <BoardCard
                                key={board.id}
                                board={board}
                                onDeleted={handleBoardDeleted}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

