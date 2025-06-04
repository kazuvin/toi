import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { toast } from "sonner";
import { createSource } from "~/services/sources";
import type { OutputFormatType } from "../use-output-formats";

export function useContentCreation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createContent = async (
    content: string,
    selectedFormats: OutputFormatType[]
  ) => {
    if (!content || selectedFormats.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await createSource({
        content,
        type: "TEXT",
      });
      navigate(`/content/${response.id}`);
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
