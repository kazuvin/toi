import { useParams } from "@remix-run/react";
import useSWR from "swr";
import { toast } from "sonner";
import { getFlashcardsBySourceId } from "~/services/flashcard";
import { FlashcardDeck } from "~/features/flashcard/components";
import { Spinner } from "~/components/ui/spinner";
import { useContentDetail } from "~/features/content";
import { useEffect } from "react";

export default function ContentFlashcards() {
  const { id } = useParams();
  const { data: contentDetail } = useContentDetail(id);

  const { data, isLoading, error } = useSWR(
    id ? `/api/sources/${id}/flashcards` : null,
    async () => {
      const response = await getFlashcardsBySourceId(id!);
      return response;
    },
    {
      revalidateOnFocus: false,
    }
  );

  // エラー時のトースト通知
  useEffect(() => {
    if (error) {
      toast.error("フラッシュカードの読み込みに失敗しました。ページを再読み込みしてください。", {
        duration: 6000,
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600">
            フラッシュカードの読み込みに失敗しました。
          </p>
        </div>
      </div>
    );
  }

  if (!data?.flashcards || data.flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            フラッシュカードがありません
          </h2>
          <p className="text-gray-600">
            このソースにはまだフラッシュカードが作成されていません。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {contentDetail?.title ?? "タイトル未設定"}
        </h1>
      </div>

      <FlashcardDeck flashcards={data.flashcards} />
    </div>
  );
}
