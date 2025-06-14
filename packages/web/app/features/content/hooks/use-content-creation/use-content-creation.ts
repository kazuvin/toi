import { useState } from "react";
import { mutate } from "swr";
import { useNavigate } from "@remix-run/react";
import { toast } from "sonner";
import { createSource, createSourceFromUrl, createSourceFromPdf, createSourceFromYoutube } from "~/services/sources";
import type { OutputFormatType } from "../use-output-formats";
import { postFlashcard } from "~/services/flashcard";
import { postTitle } from "~/services/source";

export function useContentCreation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createContent = async (
    content: string,
    selectedFormats: OutputFormatType[],
    inputMethod: "text" | "file" | "website" | "youtube" | "pdf" = "text",
    pdfData?: { fileName: string; fileContent: string },
    youtubeData?: { url: string }
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
      } else if (inputMethod === "pdf" && pdfData) {
        // PDFからソースを作成
        response = await createSourceFromPdf({
          fileName: pdfData.fileName,
          fileContent: pdfData.fileContent,
        });
      } else if (inputMethod === "youtube" && youtubeData) {
        // YouTubeからソースを作成
        response = await createSourceFromYoutube({ url: youtubeData.url });
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
      // エラーメッセージをより詳細に
      let errorMessage = "学習コンテンツの作成に失敗しました";
      
      if (error instanceof Error) {
        if (error.message.includes("URL")) {
          errorMessage = "URLからコンテンツを取得できませんでした。URLが正しいか確認してください。";
        } else if (error.message.includes("PDF")) {
          errorMessage = "PDFファイルの処理に失敗しました。ファイルが正しいか確認してください。";
        } else if (error.message.includes("YouTube")) {
          errorMessage = "YouTube動画の処理に失敗しました。URLが正しいか確認してください。";
        } else if (error.message.includes("network")) {
          errorMessage = "ネットワークエラーが発生しました。インターネット接続を確認してください。";
        }
      }
      
      toast.error(errorMessage, { 
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
