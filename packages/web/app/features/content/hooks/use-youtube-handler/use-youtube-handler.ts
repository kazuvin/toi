import { useState } from "react";

export type YoutubeData = {
  url: string;
};

export function useYoutubeHandler() {
  const [youtubeData, setYoutubeData] = useState<YoutubeData | null>(null);

  const handleYoutubeUrlChange = (url: string) => {
    if (!url) {
      setYoutubeData(null);
      return;
    }

    // YouTube URLの簡易バリデーション
    const isValidYoutubeUrl = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(url);
    
    if (isValidYoutubeUrl) {
      setYoutubeData({ url });
    } else {
      setYoutubeData(null);
    }
  };

  const clearYoutubeData = () => {
    setYoutubeData(null);
  };

  return {
    youtubeData,
    handleYoutubeUrlChange,
    clearYoutubeData,
  };
}