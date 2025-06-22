import { useParams, Link, type MetaFunction } from "@remix-run/react";
import useSWR from "swr";
import { toast } from "sonner";
import { getFlashcardsBySourceId } from "~/services/flashcard";
import { FlashcardDeck, FlashcardHeader } from "~/features/flashcard/components";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { useContentDetail } from "~/features/content";
import { useEffect } from "react";
import { Edit } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "フラッシュカード - Toi" },
    { 
      name: "description", 
      content: "AIが生成したフラッシュカードで学習しましょう。効率的な暗記学習をサポートします。"
    }
  ];
};

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
    <div className="flex flex-col h-screen">
      <FlashcardHeader title={contentDetail?.title ?? "タイトル未設定"} />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 flex justify-end">
            <Button asChild variant="outline">
              <Link to={`/content/${id}/flashcards/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                一括編集
              </Link>
            </Button>
          </div>
          <FlashcardDeck flashcards={data.flashcards} />
        </div>
      </div>
    </div>
  );
}
