'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/auth-provider';
import Sidebar from '@/src/components/dashbord/SideBar';
import { BoardCard } from '../boards/[boardId]/boardCard';

type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    visibility: string;
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
    const [search, setSearch] = useState('');

    const handleBoardDeleted = (deletedBoardId: string) => {
        setBoards((previousBoards) =>
            previousBoards.filter(
                (board) => board.id !== deletedBoardId
            )
        );
    };

    // Filter boards by title
    const filteredBoards = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return boards;
        }

        return boards.filter((board) =>
            board.title.toLowerCase().includes(searchValue)
        );
    }, [boards, search]);

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
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
                <p className="text-sm font-medium">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="min-h-screen p-6 md:ml-64 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Welcome back, <span className="font-medium text-slate-700">{user.name}</span>
                    </p>
                </div>

                <section className="mt-8">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-slate-800">
                            Your Boards
                        </h2>
                        <button
                            type="button"
                            onClick={() => router.push('/boards/newBoard')}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            + Create Board
                        </button>
                    </div>

                    {/* Search input */}
                    <div className="mb-6">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search boards by title..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-md shadow-sm"
                        />
                    </div>

                    {boardsLoading && (
                        <p className="text-sm text-slate-500">
                            Loading boards...
                        </p>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {!boardsLoading && !error && boards.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                            <p className="text-sm font-medium text-slate-700">No boards yet</p>
                            <p className="mt-1 text-xs text-slate-500">Create your first board to start organizing your workflow.</p>
                        </div>
                    )}

                    {/* No search results */}
                    {!boardsLoading &&
                        !error &&
                        boards.length > 0 &&
                        filteredBoards.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No boards found for &ldquo;{search}&rdquo;.
                            </p>
                        )}

                    {/* Display all boards or filtered boards */}
                    {!boardsLoading &&
                        !error &&
                        filteredBoards.length > 0 && (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredBoards.map((board) => (
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
        </div>
    );
}
