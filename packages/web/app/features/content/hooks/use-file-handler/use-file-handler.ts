import { useState } from "react";

export function useFileHandler() {
  const [inputText, setInputText] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error("クリップボードからの読み取りに失敗しました:", err);
    }
  };

  const clearInput = () => {
    setInputText("");
  };

  return {
    inputText,
    setInputText,
    handleFileUpload,
    handlePasteFromClipboard,
    clearInput,
  };
}
