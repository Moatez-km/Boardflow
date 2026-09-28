"use client";

import { FormEvent, useState } from "react";

type CreateCardModalProps = {
    boardId: string;
    sectionId: string;
    sectionTitle: string;
    onClose: () => void;
    onCreated: (card: Card) => void;
};

type Card = {
    id: string;
    title: string;
    content?: string | null;
    type: string;
    sectionId: string | null;
    position: number | string;
};

export default function CreateCardModal({
    boardId,
    sectionId,
    sectionTitle,
    onClose,
    onCreated,
}: CreateCardModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            setError("Card title is required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}/cards`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim(),
                        type: "TEXT",
                        sectionId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to create card"
                );
            }

            onCreated(data);
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not create card"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Add card
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Adding to: {sectionTitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-slate-400 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>

                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Card title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="For example, Solve exercise 1"
                    autoFocus
                    disabled={isSubmitting}
                    className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Content
                </label>

                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Add card details"
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                {error && (
                    <p className="mt-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add card"}
                    </button>
                </div>
            </form>
        </div>
    );
}
