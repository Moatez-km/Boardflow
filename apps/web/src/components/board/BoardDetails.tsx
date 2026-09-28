"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/auth-provider";
import Sidebar from "@/src/components/dashbord/SideBar";
import { Plus, X } from "lucide-react";
import CreateCardModal from "@/src/components/board/CreateCardModal";


type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    visibility: string;
};

type Section = {
    id: string;
    title: string;
    position: number | string;
    cards?: Card[];
};

type BoardDetailsProps = {
    boardId: string;
};
type Card = {
    id: string;
    title: string;
    content?: string | null;
    type: string;
    sectionId: string | null;
    position: number | string;
};


export default function BoardDetails({
    boardId,
}: BoardDetailsProps) {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [board, setBoard] = useState<Board | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isCreatingSection, setIsCreatingSection] = useState(false);
    const [sectionTitle, setSectionTitle] = useState("");
    const [isSubmittingSection, setIsSubmittingSection] = useState(false);
    const [sectionError, setSectionError] = useState<string | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedSection, setSelectedSection] =
        useState<Section | null>(null);
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (!user || !boardId) return;

        async function fetchBoardData() {
            try {
                setLoading(true);
                setError(null);

                const [boardResponse, sectionsResponse, cardsResponse] = await Promise.all([
                    fetch(`http://localhost:3001/api/boards/${boardId}`, {
                        credentials: "include",
                    }),

                    fetch(
                        `http://localhost:3001/api/boards/${boardId}/sections`,
                        {
                            credentials: "include",
                        }
                    ),
                    fetch(
                        `http://localhost:3001/api/boards/${boardId}/cards`,
                        {
                            credentials: "include",
                        }),
                ]);

                const boardData = await boardResponse.json();
                const sectionsData = await sectionsResponse.json();
                const cardsData = await cardsResponse.json();
                if (!boardResponse.ok) {
                    throw new Error(
                        boardData?.message || "Failed to fetch board"
                    );
                }
                if (!cardsResponse.ok) {
                    throw new Error(
                        cardsData?.message || "Failed to fetch cards"
                    );
                }
                if (!sectionsResponse.ok) {
                    throw new Error(
                        sectionsData?.message || "Failed to fetch sections"
                    );
                }

                const fetchedSections: Section[] = Array.isArray(sectionsData)
                    ? sectionsData
                    : sectionsData?.sections ?? sectionsData?.data ?? [];
                const fetchedCards: Card[] = Array.isArray(cardsData)
                    ? cardsData
                    : cardsData?.cards ?? cardsData?.data ?? [];
                setBoard(boardData);
                setSections(
                    fetchedSections.sort(
                        (a, b) => Number(a.position) - Number(b.position)
                    )
                );
                setCards(fetchedCards);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Could not load board"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchBoardData();
    }, [boardId, user]);

    async function handleCreateSection(e: React.FormEvent) {
        e.preventDefault();
        const title = sectionTitle.trim();
        if (!title) {
            setSectionError("Section title is required");
            return;
        }

        const nextPosition =
            sections.length > 0
                ? Math.max(...sections.map((s) => Number(s.position))) + 1
                : 0;

        try {
            setIsSubmittingSection(true);
            setSectionError(null);

            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}/sections`,
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
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Failed to create section");
            }

            // Refresh sections
            const sectionsRes = await fetch(
                `http://localhost:3001/api/boards/${boardId}/sections`,
                { credentials: "include" }
            );
            const sectionsData = await sectionsRes.json();
            const updatedSections: Section[] = Array.isArray(sectionsData)
                ? sectionsData
                : sectionsData?.sections ?? sectionsData?.data ?? [];

            setSections(
                updatedSections.sort(
                    (a, b) => Number(a.position) - Number(b.position)
                )
            );

            setSectionTitle("");
            setIsCreatingSection(false);
        } catch (err) {
            setSectionError(
                err instanceof Error
                    ? err.message
                    : "Could not create section"
            );
        } finally {
            setIsSubmittingSection(false);
        }
    }

    if (authLoading || (loading && !board)) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Sidebar />
                <main className="min-h-screen p-6 md:ml-64 md:p-8 flex items-center justify-center">
                    <p className="text-sm font-medium text-slate-500">
                        Loading board...
                    </p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Sidebar />
                <main className="min-h-screen p-6 md:ml-64 md:p-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                </main>
            </div>
        );
    }

    if (!board) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Sidebar />
                <main className="min-h-screen p-6 md:ml-64 md:p-8">
                    <p className="text-sm text-slate-500">
                        Board not found.
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="min-h-screen p-6 md:ml-64 md:p-8">
                {/* Board header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm text-slate-400">
                            Boards / {board.title}
                        </p>

                        <h1 className="text-2xl font-bold text-slate-800">
                            {board.title}
                        </h1>

                        {board.description && (
                            <p className="mt-2 text-sm text-slate-500">
                                {board.description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsCreatingSection((prev) => !prev);
                            setSectionError(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4" />
                        {isCreatingSection ? "Close" : "Create section"}
                    </button>
                </div>

                {/* Inline section creation form */}
                {isCreatingSection && (
                    <div className="mb-6 max-w-md rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
                        <h3 className="mb-2 text-sm font-semibold text-slate-800">
                            New Section
                        </h3>
                        <form onSubmit={handleCreateSection}>
                            <input
                                type="text"
                                value={sectionTitle}
                                onChange={(e) => setSectionTitle(e.target.value)}
                                placeholder="Section name (e.g. In Progress)"
                                autoFocus
                                disabled={isSubmittingSection}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                            />
                            {sectionError && (
                                <p className="mt-2 text-xs text-red-600">
                                    {sectionError}
                                </p>
                            )}
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmittingSection}
                                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmittingSection ? "Creating..." : "Create section"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingSection(false);
                                        setSectionTitle("");
                                        setSectionError(null);
                                    }}
                                    disabled={isSubmittingSection}
                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Sections as columns */}
                <div className="flex items-start gap-5 overflow-x-auto pb-6">
                    {sections.length > 0 ? (
                        sections.map((section) => (
                            <SectionColumn
                                key={section.id}
                                section={section}
                                cards={cards.filter(
                                    (card) => card.sectionId === section.id
                                )}
                                onAddCard={() => setSelectedSection(section)}
                            />
                        ))
                    ) : (
                        <div className="flex min-h-48 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
                            <p className="text-sm">
                                No sections created yet. Click &ldquo;Create section&rdquo; to add your first column.
                            </p>
                        </div>
                    )}
                </div>
                {selectedSection && (
                    <CreateCardModal
                        boardId={boardId}
                        sectionId={selectedSection.id}
                        sectionTitle={selectedSection.title}
                        onClose={() => setSelectedSection(null)}
                        onCreated={(newCard) => {
                            setCards((currentCards) => [
                                ...currentCards,
                                newCard,
                            ]);
                        }}
                    />
                )}

            </main>
        </div>
    );
}

function SectionColumn({
    section,
    cards,
    onAddCard,
}: {
    section: Section;
    cards: Card[];
    onAddCard: () => void;
}) {
    return (
        <div className="w-72 shrink-0 rounded-xl bg-slate-100 p-4">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase text-slate-700">
                    {section.title}
                </h2>

                <button
                    type="button"
                    className="text-lg text-slate-400 hover:text-slate-700"
                >
                    ⋮
                </button>
            </div>

            <div className="min-h-56 space-y-3">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div
                            key={card.id}
                            className="rounded-lg bg-white p-3 shadow-sm"
                        >
                            <p className="text-sm font-medium text-slate-800">
                                {card.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {card.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300">
                        <p className="text-xs text-slate-400">
                            No cards yet
                        </p>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={onAddCard}
                className="mt-4 w-full rounded-lg bg-blue-100 py-2 text-sm text-blue-600 hover:bg-blue-200"
            >
                + Add card
            </button>
        </div>

    );
}
