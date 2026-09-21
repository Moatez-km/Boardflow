type Board = {
    id: string;
    title: string;
    description?: string | null;
    viewType: string;
    updatedAt: string;
};

export function BoardCard({ board }: { board: Board }) {
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
        </article>
    );
}
