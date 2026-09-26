'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    visibility: string;
    updatedAt: string;
};

type BoardCardProps = {
    board: Board;
    onDeleted: (boardId: string) => void;
};

export function BoardCard({
    board,
    onDeleted,
}: BoardCardProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${board.title}"?`
        );

        if (!confirmed) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:3001/api/boards/${board.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || 'Failed to delete board'
                );
            }

            // Remove the deleted card from the parent component
            onDeleted(board.id);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Could not delete board'
            );

            setIsDeleting(false);
        }
    };

    return (
        <article className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <div>
                <h2 className="text-base font-semibold text-slate-800 transition group-hover:text-blue-600">
                    {board.title}
                </h2>

                {board.description ? (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {board.description}
                    </p>
                ) : (
                    <p className="mt-2 text-xs italic text-slate-400">
                        No description provided
                    </p>
                )}
            </div>

            <div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                        {board.viewType}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                        {board.visibility}
                    </span>
                </div>

                {error && (
                    <p className="mt-3 text-xs text-red-600">
                        {error}
                    </p>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={() => router.push(`/boards/${board.id}/edit`)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </article>
    );
}
