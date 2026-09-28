"use client";

import { FormEvent, useState, useEffect } from "react";

type Card = {
    id: string;
    title: string;
    content?: string | null;
    type: string;
    sectionId: string | null;
    position: number | string;
};

type CreateCardModalProps = {
    boardId: string;
    sectionId: string;
    sectionTitle: string;
    card?: Card;
    onClose: () => void;
    onCreated?: (card: Card) => void;
    onUpdated?: (card: Card) => void;
};


function sanitizeCardContent(raw: unknown): string {
    if (!raw) return "";
    let str = typeof raw === "string" ? raw : JSON.stringify(raw);
    while (
        typeof str === "string" &&
        ((str.startsWith('"') && str.endsWith('"')) ||
            (str.startsWith('\\"') && str.endsWith('\\"')))
    ) {
        try {
            const parsed = JSON.parse(str);
            if (typeof parsed === "string") {
                str = parsed;
            } else {
                break;
            }
        } catch {
            break;
        }
    }
    return str;
}

export default function CreateCardModal({
    boardId,
    sectionId,
    sectionTitle,
    card,
    onUpdated,
    onClose,
    onCreated,
}: CreateCardModalProps) {
    const isEditing = Boolean(card);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    // Reset the form when a different card is selected
    useEffect(() => {
        setTitle(card?.title ?? "");
        setContent(sanitizeCardContent(card?.content));
        setError(null);
    }, [card]);
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle) {
            setError("Card title is required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const url = isEditing
                ? `http://localhost:3001/api/cards/${card?.id}`
                : `http://localhost:3001/api/boards/${boardId}/cards`;

            const response = await fetch(url, {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: trimmedTitle,
                    content: trimmedContent || null,
                    type: card?.type ?? "TEXT",
                    sectionId,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    `Failed to ${isEditing ? "update" : "create"
                    } card`
                );
            }

            // Supports APIs that return { card: ... }, { data: ... }, or the card directly
            const savedCard: Card = data?.card ?? data?.data ?? data;

            if (isEditing) {
                onUpdated?.(savedCard);
            } else {
                onCreated?.(savedCard);
            }

            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : `Could not ${isEditing ? "update" : "create"
                    } card`
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
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-black"
            >
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-black">
                            {isEditing ? "Edit card" : "Add card"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            {isEditing
                                ? `Editing card in: ${sectionTitle}`
                                : `Adding to: ${sectionTitle}`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-xl text-slate-400 hover:text-black disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                <label className="mb-1 block text-sm font-medium text-black">
                    Card title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="For example, Solve exercise 1"
                    autoFocus
                    disabled={isSubmitting}
                    className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black placeholder:text-slate-400 outline-none focus:border-blue-500"
                />

                <label className="mb-1 block text-sm font-medium text-black">
                    Content
                </label>

                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Add card details"
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-black placeholder:text-slate-400 outline-none focus:border-blue-500"
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
                        className="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Saving..."
                            : isEditing
                                ? "Update card"
                                : "Add card"}
                    </button>
                </div>
            </form>
        </div>
    );
}
