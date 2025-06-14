import { useState } from "react";
import { mutate } from "swr";
import { useNavigate } from "@remix-run/react";
import { toast } from "sonner";
import { createSource, createSourceFromUrl } from "~/services/sources";
import type { OutputFormatType } from "../use-output-formats";
import { postFlashcard } from "~/services/flashcard";
import { postTitle } from "~/services/source";

export function useContentCreation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createContent = async (
    content: string,
    selectedFormats: OutputFormatType[],
    inputMethod: "text" | "file" | "website" | "youtube" = "text"
  ) => {
    if (!content || selectedFormats.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      // 入力方法に応じてソースを作成
      if (inputMethod === "website") {
        // URLからソースを作成
        toast.loading("Webサイトからコンテンツを取得中...", { id: "content-creation" });
        response = await createSourceFromUrl({ url: content });
        toast.success("Webサイトからコンテンツを取得しました", { id: "content-creation" });
      } else {
        // テキストまたはファイルからソースを作成
        toast.loading("コンテンツを処理中...", { id: "content-creation" });
        response = await createSource({
          content,
          type: "TEXT",
        });
        toast.success("コンテンツを作成しました", { id: "content-creation" });
      }

      // タイトル生成とフラッシュカード作成
      toast.loading("タイトルとフラッシュカードを生成中...", { id: "content-creation" });
      
      // ソースのタイトルを更新
      await postTitle({ sourceId: response.id });

      // フラッシュカードを作成
      await postFlashcard({ sourceId: response.id });

      // ソース一覧を更新
      mutate("/api/sources");

      // 成功通知
      toast.success("学習コンテンツが正常に作成されました！フラッシュカードの学習を開始できます。", { 
        id: "content-creation",
        duration: 5000 
      });

      navigate(`/content/${response.id}/flashcards`);
    } catch (error) {
      // エラーメッセージをより詳細に
      let errorMessage = "学習コンテンツの作成に失敗しました";
      
      if (error instanceof Error) {
        if (error.message.includes("URL")) {
          errorMessage = "URLからコンテンツを取得できませんでした。URLが正しいか確認してください。";
        } else if (error.message.includes("network")) {
          errorMessage = "ネットワークエラーが発生しました。インターネット接続を確認してください。";
        }
      }
      
      toast.error(errorMessage, { 
        id: "content-creation",
        duration: 6000 
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createContent,
  };
}
