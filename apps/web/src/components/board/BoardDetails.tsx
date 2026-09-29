"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/auth-provider";
import Sidebar from "@/src/components/dashbord/SideBar";
import { Plus, X, Pencil, Trash2, GripVertical } from "lucide-react";
import CreateCardModal from "@/src/components/board/CreateCardModal";

import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export default function BoardDetails({ boardId }: BoardDetailsProps) {
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
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);

    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
    const [cardActionError, setCardActionError] = useState<string | null>(null);
    const [activeCard, setActiveCard] = useState<Card | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDeleteCard(cardId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this card?"
        );

        if (!confirmed) return;

        try {
            setDeletingCardId(cardId);
            setCardActionError(null);

            const response = await fetch(
                `http://localhost:3001/api/cards/${cardId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.message || "Failed to delete card");
            }

            setCards((currentCards) =>
                currentCards.filter((card) => card.id !== cardId)
            );
        } catch (err) {
            setCardActionError(
                err instanceof Error ? err.message : "Could not delete card"
            );
        } finally {
            setDeletingCardId(null);
        }
    }

    function handleCardUpdated(updatedCard: Card) {
        setCards((currentCards) =>
            currentCards.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
            )
        );

        setEditingCard(null);
    }

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

                const [boardResponse, sectionsResponse, cardsResponse] =
                    await Promise.all([
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
                            }
                        ),
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
                setCards(
                    fetchedCards.sort(
                        (a, b) => Number(a.position) - Number(b.position)
                    )
                );
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

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const foundCard = cards.find((c) => c.id === active.id);
        if (foundCard) {
            setActiveCard(foundCard);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) return;

        const currentCard = cards.find((c) => c.id === activeId);
        if (!currentCard) return;

        const overSection = sections.find((s) => s.id === overId);
        const overCard = cards.find((c) => c.id === overId);

        const targetSectionId = overSection
            ? overSection.id
            : overCard?.sectionId ?? null;

        if (targetSectionId && currentCard.sectionId !== targetSectionId) {
            setCards((prevCards) =>
                prevCards.map((c) =>
                    c.id === activeId
                        ? { ...c, sectionId: targetSectionId }
                        : c
                )
            );
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const draggedCard = cards.find((c) => c.id === activeId);
        if (!draggedCard) return;

        const overSection = sections.find((s) => s.id === overId);
        const overCard = cards.find((c) => c.id === overId);

        const targetSectionId = overSection
            ? overSection.id
            : overCard?.sectionId ?? null;

        if (!targetSectionId) return;

        const sectionCards = cards
            .filter(
                (c) => c.sectionId === targetSectionId && c.id !== activeId
            )
            .sort((a, b) => Number(a.position) - Number(b.position));

        let newPosition: number;

        if (overSection) {
            const lastCard = sectionCards[sectionCards.length - 1];
            newPosition = lastCard ? Number(lastCard.position) + 1000 : 1000;
        } else if (overCard) {
            const overIndex = sectionCards.findIndex((c) => c.id === overCard.id);
            if (overIndex === -1) {
                const lastCard = sectionCards[sectionCards.length - 1];
                newPosition = lastCard ? Number(lastCard.position) + 1000 : 1000;
            } else {
                const prevCard = sectionCards[overIndex - 1];
                const nextCard = sectionCards[overIndex];

                if (!prevCard) {
                    newPosition = Number(nextCard.position) / 2;
                } else {
                    newPosition =
                        (Number(prevCard.position) + Number(nextCard.position)) / 2;
                }
            }
        } else {
            newPosition = Number(draggedCard.position);
        }

        const previousCards = [...cards];

        // Optimistically update local cards
        setCards((prevCards) =>
            prevCards
                .map((c) =>
                    c.id === activeId
                        ? {
                              ...c,
                              sectionId: targetSectionId,
                              position: newPosition,
                          }
                        : c
                )
                .sort((a, b) => Number(a.position) - Number(b.position))
        );

        // Sync with API
        try {
            setCardActionError(null);
            const response = await fetch(
                `http://localhost:3001/api/cards/${activeId}/reorder`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        sectionId: targetSectionId,
                        position: newPosition,
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Failed to reorder card");
            }
        } catch (err) {
            // Rollback on failure
            setCards(previousCards);
            setCardActionError(
                err instanceof Error ? err.message : "Failed to move card"
            );
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
                    <p className="text-sm text-slate-500">Board not found.</p>
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

                {cardActionError && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                        {cardActionError}
                    </div>
                )}

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
                                    {isSubmittingSection
                                        ? "Creating..."
                                        : "Create section"}
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

                {/* Drag and Drop Sections & Cards */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex items-start gap-5 overflow-x-auto pb-6">
                        {sections.length > 0 ? (
                            sections.map((section) => (
                                <SectionColumn
                                    key={section.id}
                                    section={section}
                                    cards={cards.filter(
                                        (card) =>
                                            card.sectionId === section.id
                                    )}
                                    onAddCard={() => setSelectedSection(section)}
                                    onEditCard={(card) => setEditingCard(card)}
                                    onDeleteCard={handleDeleteCard}
                                    deletingCardId={deletingCardId}
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

                    <DragOverlay>
                        {activeCard ? (
                            <div className="w-72 rounded-lg bg-white p-3 shadow-xl ring-2 ring-blue-500/20 rotate-1">
                                <p className="text-sm font-medium text-slate-800">
                                    {activeCard.title}
                                </p>
                                {activeCard.content ? (
                                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                        {formatCardContent(activeCard.content)}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

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
                            setSelectedSection(null);
                        }}
                    />
                )}

                {editingCard && (
                    <CreateCardModal
                        boardId={boardId}
                        sectionId={editingCard.sectionId ?? ""}
                        sectionTitle="Edit card"
                        card={editingCard}
                        onClose={() => setEditingCard(null)}
                        onUpdated={handleCardUpdated}
                    />
                )}
            </main>
        </div>
    );
}

function formatCardContent(raw: unknown): string {
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

function DraggableCardItem({
    card,
    onEditCard,
    onDeleteCard,
    deletingCardId,
}: {
    card: Card;
    onEditCard: (card: Card) => void;
    onDeleteCard: (cardId: string) => void;
    deletingCardId: string | null;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs transition hover:border-slate-300 hover:shadow-sm cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 pr-1">
                    <p className="text-sm font-medium text-slate-800 select-none">
                        {card.title}
                    </p>

                    {card.content ? (
                        <p className="mt-1 text-xs text-slate-500 whitespace-pre-wrap select-none">
                            {formatCardContent(card.content)}
                        </p>
                    ) : null}
                </div>

                <div
                    className="flex shrink-0 gap-1"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={() => onEditCard(card)}
                        className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                        title="Edit card"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDeleteCard(card.id)}
                        disabled={deletingCardId === card.id}
                        className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition"
                        title="Delete card"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionColumn({
    section,
    cards,
    onAddCard,
    onEditCard,
    onDeleteCard,
    deletingCardId,
}: {
    section: Section;
    cards: Card[];
    onAddCard: () => void;
    onEditCard: (card: Card) => void;
    onDeleteCard: (cardId: string) => void;
    deletingCardId: string | null;
}) {
    const { setNodeRef } = useDroppable({
        id: section.id,
        data: {
            type: "Section",
            section,
        },
    });

    const cardIds = cards.map((c) => c.id);

    return (
        <div
            ref={setNodeRef}
            className="w-72 shrink-0 rounded-xl bg-slate-100/90 p-4 border border-slate-200/60"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {section.title}
                    </h2>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        {cards.length}
                    </span>
                </div>

                <button
                    type="button"
                    className="text-slate-400 hover:text-slate-700 text-sm px-1 rounded"
                >
                    ⋮
                </button>
            </div>

            <SortableContext
                items={cardIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="min-h-56 space-y-2.5">
                    {cards.map((card) => (
                        <DraggableCardItem
                            key={card.id}
                            card={card}
                            onEditCard={onEditCard}
                            onDeleteCard={onDeleteCard}
                            deletingCardId={deletingCardId}
                        />
                    ))}
                </div>
            </SortableContext>

            <button
                type="button"
                onClick={onAddCard}
                className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition"
            >
                <Plus className="h-3.5 w-3.5" />
                Add card
            </button>
        </div>
    );
}
