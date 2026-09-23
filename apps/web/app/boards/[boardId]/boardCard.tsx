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
        <article className="rounded-lg border p-4">
            <h2 className="font-semibold">{board.title}</h2>

            {board.description && (
                <p className="mt-2 text-sm text-gray-600">
                    {board.description}
                </p>
            )}

            <p className="mt-3 text-xs text-gray-500">
                View: {board.viewType}
            </p>
            <p className="mt-3 text-xs text-gray-500">
                Visibility: {board.visibility}
            </p>

            {error && (
                <p className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => router.push(`/boards/${board.id}/edit`)}
                    className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </article>
    );
}
