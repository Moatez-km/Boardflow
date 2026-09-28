import BoardDetails from "@/src/components/board/BoardDetails";

type PageProps = {
    params: Promise<{
        boardId: string;
    }>;
};

export default async function BoardPage({ params }: PageProps) {
    const { boardId } = await params;
    return <BoardDetails boardId={boardId} />;
}
