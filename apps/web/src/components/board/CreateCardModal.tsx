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
type Attachment = {
    id: string;
    cardId: string;
    filename: string;
    mimeType: string;
    size: number | string;
    storageKey: string;
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedAttachment, setUploadedAttachment] =
        useState<Attachment | null>(null);
    const [error, setError] = useState<string | null>(null);


    // Reset the form when a different card is selected
    useEffect(() => {
        setTitle(card?.title ?? "");
        setContent(sanitizeCardContent(card?.content));
        setError(null);
        setSelectedFile(null);
        setUploadedAttachment(null);
    }, [card]);
    async function handleFileUpload(
        file: File,
        cardId: string
    ): Promise<any> {
        try {
            setIsUploading(true);
            setError(null);

            // -----------------------------
            // 1. Ask NestJS for upload URL
            // -----------------------------

            const presignResponse = await fetch(
                "http://localhost:3001/api/files/presign",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        cardId,
                        filename: file.name,
                        mimeType: file.type,
                        size: file.size,
                    }),
                }
            );

            const presignData =
                await presignResponse.json().catch(() => null);

            if (!presignResponse.ok) {
                throw new Error(
                    presignData?.message ||
                    "Could not create upload URL"
                );
            }

            const {
                uploadUrl,
                storageKey,
            } = presignData;


            // -----------------------------
            // 2. Upload directly to MinIO
            // -----------------------------

            const uploadResponse = await fetch(
                uploadUrl,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error(
                    "File upload to storage failed"
                );
            }


            // -----------------------------
            // 3. Tell NestJS upload is done
            // -----------------------------

            const completeResponse = await fetch(
                "http://localhost:3001/api/files/complete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        cardId,
                        storageKey,
                        filename: file.name,
                        mimeType: file.type,
                        size: file.size,
                    }),
                }
            );

            const completeData =
                await completeResponse.json().catch(() => null);

            if (!completeResponse.ok) {
                throw new Error(
                    completeData?.message ||
                    "Could not complete file upload"
                );
            }

            const attachment =
                completeData?.attachment ??
                completeData?.data ??
                completeData;

            setUploadedAttachment(attachment);
            setSelectedFile(null);
            return true;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not upload file"
            );
            return false;
        } finally {
            setIsUploading(false);
        }
    }
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
            const savedCard: Card =
                data?.card ??
                data?.data ??
                data;


            // ----------------------------------
            // Upload attachment if one was chosen
            // ----------------------------------

            if (selectedFile) {
                const uploadSucceeded =
                    await handleFileUpload(
                        selectedFile,
                        savedCard.id
                    );

                if (!uploadSucceeded) {
                    // Card was created, but attachment failed.
                    return;
                }
            }


            // ----------------------------------
            // Notify parent
            // ----------------------------------

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
                <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-black">
                        Attachment
                    </label>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="card-file-upload"
                            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Choose file
                        </label>

                        <input
                            id="card-file-upload"
                            type="file"
                            className="hidden"
                            disabled={isSubmitting || isUploading}
                            onChange={(event) => {
                                const file =
                                    event.target.files?.[0];

                                if (!file) return;

                                setSelectedFile(file);
                            }}
                        />

                        {selectedFile && (
                            <span className="truncate text-sm text-slate-600">
                                {selectedFile.name}
                            </span>
                        )}
                    </div>
                </div>
                {selectedFile && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                                {selectedFile.name}
                            </p>

                            <p className="text-xs text-slate-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={isSubmitting || isUploading}
                            onClick={() => setSelectedFile(null)}
                            className="ml-3 text-sm text-red-600 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                )}
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
