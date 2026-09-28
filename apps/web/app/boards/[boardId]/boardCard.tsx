'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    visibility: string;
    sections: Section[];
    updatedAt: string;
};

type BoardCardProps = {
    board: Board;
    onDeleted: (boardId: string) => void;
    onSectionCreated: (
        boardId: string,
        sections: Section[]
    ) => void;
};
type Section = {
    id: string;
    title: string;
    position: number | string;
};
export function BoardCard({
    board,
    onDeleted,
    onSectionCreated
}: BoardCardProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [sectionTitle, setSectionTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sections = board.sections ?? [];

    {/*Create Section to the Board Card */ }
    async function handleCreateSection(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const title = sectionTitle.trim();

        if (!title) {
            setError("Section title is required");
            return;
        }
        const nextPosition =
            sections.length > 0
                ? Math.max(
                    ...sections.map(
                        (section) => Number(section.position)
                    )
                ) + 1
                : 0;

        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(
                `http://localhost:3001/api/boards/${board.id}/sections`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        title,
                        position: nextPosition,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create section");
            }

            await response.json().catch(() => null);

            // Fetch the latest sections for this board
            const sectionsResponse = await fetch(
                `http://localhost:3001/api/boards/${board.id}/sections`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            const sectionsData = await sectionsResponse.json();

            if (!sectionsResponse.ok) {
                throw new Error(
                    sectionsData?.message || 'Failed to fetch sections'
                );
            }

            // Supports either:
            // [section1, section2]
            // or { sections: [section1, section2] }
            const updatedSections: Section[] = Array.isArray(sectionsData)
                ? sectionsData
                : sectionsData?.sections ?? sectionsData?.data ?? [];


            onSectionCreated(board.id, updatedSections);

            setSectionTitle('');
            setIsAddingSection(false);

        } catch {
            setError("Could not create section. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    {/*Delete Board Card */ }
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
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 truncate text-base font-semibold text-slate-800 transition group-hover:text-blue-600">
                        {board.title}
                    </h2>

                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(`/boards/${board.id}/edit`)
                            }
                            aria-label={`Edit ${board.title}`}
                            title="Edit board"
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            aria-label={`Delete ${board.title}`}
                            title={
                                isDeleting
                                    ? 'Deleting...'
                                    : 'Delete board'
                            }
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Description */}
                {board.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {board.description}
                    </p>
                ) : (
                    <p className="mt-2 text-xs italic text-slate-400">
                        No description provided
                    </p>
                )}

                {/* Board metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                        {board.viewType}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                        {board.visibility}
                    </span>
                </div>

                {/* Sections */}
                <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Sections
                        </p>

                        <span className="text-xs text-slate-400">
                            {sections.length}
                        </span>
                    </div>

                    {sections.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {sections
                                .slice()
                                .sort((a, b) => Number(a.position) - Number(b.position))
                                .slice(0, 3)
                                .map((section) => (
                                    <span
                                        key={section.id}
                                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                                    >
                                        {section.title}
                                    </span>
                                ))}

                            {sections.length > 3 && (
                                <span className="px-2 py-1 text-xs text-slate-400">
                                    +{sections.length - 3} more
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs italic text-slate-400">
                            No sections yet
                        </p>
                    )}
                </div>

                {/* Add section form */}
                {isAddingSection && (
                    <form
                        onSubmit={handleCreateSection}
                        className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3"
                    >
                        <label
                            htmlFor={`section-${board.id}`}
                            className="mb-1 block text-xs font-medium text-slate-700"
                        >
                            Section name
                        </label>

                        <input
                            id={`section-${board.id}`}
                            type="text"
                            value={sectionTitle}
                            onChange={(event) =>
                                setSectionTitle(event.target.value)
                            }
                            placeholder="For example, TODO"
                            autoFocus
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                        />

                        <div className="mt-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Adding...' : 'Add section'}
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setIsAddingSection(false);
                                    setSectionTitle('');
                                    setError(null);
                                }}
                                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
                            >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Error message */}
                {error && (
                    <p className="mt-3 text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>

            {/* Footer actions */}
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    onClick={() => {
                        setIsAddingSection((current) => !current);
                        setError(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Plus className="h-3.5 w-3.5" />
                    {isAddingSection ? 'Close' : 'Add section'}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/boards/${board.id}`)}
                    className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                    Open board
                </button>
            </div>
        </article>
    );
}
