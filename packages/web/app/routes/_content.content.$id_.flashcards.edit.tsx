import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { type FlashcardBulkEditData } from "~/features/flashcard/components/flashcard-bulk-edit";
import { FlashcardBulkEdit } from "~/features/flashcard/components/flashcard-bulk-edit";
import { getFlashcardsBySourceId } from "~/services/flashcard";
import useSWR from "swr";

export const meta: MetaFunction = () => {
  return [
    { title: "フラッシュカード一括編集 - Toi" },
    { name: "description", content: "フラッシュカードを一括で編集できます" },
  ];
};

export function clientLoader({ params }: LoaderFunctionArgs) {
  return { sourceId: params.id! };
}

export default function FlashcardBulkEditPage() {
  const { id: sourceId } = useParams<{ id: string }>();
  
  const { 
    data: flashcards, 
    error, 
    isLoading,
    mutate 
  } = useSWR(
    sourceId ? `flashcards-${sourceId}` : null,
    () => sourceId ? getFlashcardsBySourceId(sourceId) : null
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">フラッシュカードを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-2">エラーが発生しました</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!flashcards?.flashcards || flashcards.flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">フラッシュカードがありません</p>
        </div>
      </div>
    );
  }

  const bulkEditData: FlashcardBulkEditData[] = flashcards.flashcards.map((card) => ({
    id: card.id,
    question: card.question,
    answer: card.answer,
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <FlashcardBulkEdit 
        sourceId={sourceId!}
        flashcards={bulkEditData}
        onUpdate={() => mutate()}
      />
    </div>
  );
}