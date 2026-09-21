'use client';

import { useRouter } from 'next/navigation';

type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    updatedAt: string;
};


export function BoardCard({ board }: { board: Board }) {
    const router = useRouter();
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
            <button
                type="button"
                onClick={() =>
                    router.push(
                        `boards/${board.id}/edit`
                    )
                }
                className="mt-4 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100"
            >
                Edit
            </button>
        </article>
    );
}
