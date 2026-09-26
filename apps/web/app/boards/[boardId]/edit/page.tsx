
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
type Visibility =
    | 'PRIVATE'
    | 'PUBLIC';
type ViewType =
    | 'KANBAN'
    | 'CANVAS'
    | 'TIMELINE'
    | 'MAP'
    | 'BLOG';

export default function EditBoardPage() {
    const router = useRouter();
    const params = useParams();

    const boardId = params.boardId as string;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [viewType, setViewType] =
        useState<ViewType>('KANBAN');
    const [visibility, setVisibility] =
        useState<Visibility>('PRIVATE');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /*
     * Load existing board
     */
    useEffect(() => {
        async function loadBoard() {
            if (!boardId) {
                setError('Board ID is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `http://localhost:3001/api/boards/${boardId}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                const data = await response.json();

                console.log('Loaded board:', data);

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        `Failed to load board (${response.status})`
                    );
                }

                /*
                 * If your API returns:
                 *
                 * {
                 *   id: "...",
                 *   title: "...",
                 *   description: "...",
                 *   viewType: "KANBAN"
                 * }
                 *
                 * this works directly.
                 */
                const board = data.board ?? data;

                // Fill the form with existing values
                setTitle(board.title ?? '');
                setDescription(board.description ?? '');
                setViewType(board.viewType ?? 'KANBAN');
                setVisibility(board.visibility ?? 'PRIVATE');
            } catch (error) {
                console.error(
                    'Failed to load board:',
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load board.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadBoard();
    }, [boardId]);

    /*
     * Update board
     */
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        viewType,
                        visibility,
                    }),
                }
            );

            const data = await response.json();

            console.log('Updated board:', data);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    `Failed to update board (${response.status})`
                );
            }

            // Return to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error(
                'Failed to update board:',
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to update board.'
            );
        } finally {
            setSaving(false);
        }
    };

    /*
     * Loading existing board
     */
    if (loading) {
        return (
            <main className="min-h-screen bg-black p-8 text-white">
                <div className="mx-auto max-w-2xl">
                    <p className="text-gray-400">
                        Loading board...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-2xl">

                {/* Back */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={saving}
                    className="mb-6 text-sm text-gray-400 transition hover:text-white disabled:opacity-50"
                >
                    ← Back
                </button>

                {/* Title */}
                <h1 className="text-3xl font-bold">
                    Edit Board
                </h1>

                <p className="mt-2 text-gray-400">
                    Update your board information.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6 rounded-xl border border-gray-800 bg-black p-6 shadow-2xl"
                >
                    {/* Board title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-white"
                        >
                            Board title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="My board"
                            required
                            disabled={saving}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:opacity-50"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-white"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="What is this board for?"
                            rows={4}
                            disabled={saving}
                            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:opacity-50"
                        />
                    </div>

                    {/* View type */}
                    <div>
                        <label
                            htmlFor="viewType"
                            className="mb-2 block text-sm font-medium text-white"
                        >
                            View type
                        </label>

                        <select
                            id="viewType"
                            value={viewType}
                            onChange={(event) =>
                                setViewType(
                                    event.target.value as ViewType
                                )
                            }
                            disabled={saving}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:opacity-50"
                        >
                            <option value="KANBAN">
                                Kanban
                            </option>

                            <option value="CANVAS">
                                Canvas
                            </option>

                            <option value="TIMELINE">
                                Timeline
                            </option>

                            <option value="MAP">
                                Map
                            </option>

                            <option value="BLOG">
                                Blog
                            </option>
                        </select>
                    </div>
                    {/* Visibility */}
                    <div>
                        <label
                            htmlFor="visibility"
                            className="mb-2 block text-sm font-medium text-white"
                        >
                            Visibility
                        </label>

                        <select
                            id="visibility"
                            value={visibility}
                            onChange={(event) =>
                                setVisibility(
                                    event.target.value as Visibility
                                )
                            }
                            disabled={saving}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:opacity-50"
                        >
                            <option value="PRIVATE">
                                Private
                            </option>

                            <option value="PUBLIC">
                                Public
                            </option>
                        </select>
                    </div>
                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={saving}
                            className="rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-300 transition hover:bg-gray-900 hover:text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-white px-4 py-2 font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

