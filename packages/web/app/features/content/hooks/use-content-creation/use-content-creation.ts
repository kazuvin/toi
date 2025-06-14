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
        response = await createSourceFromUrl({ url: content });
      } else {
        // テキストまたはファイルからソースを作成
        response = await createSource({
          content,
          type: "TEXT",
        });
      }

      // ソースのタイトルを更新
      await postTitle({ sourceId: response.id });

      // フラッシュカードを作成
      await postFlashcard({ sourceId: response.id });

      // ソース一覧を更新
      mutate("/api/sources");

      navigate(`/content/${response.id}/flashcards`);
    } catch (error) {
      toast.error("学習コンテンツの作成に失敗しました");
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
