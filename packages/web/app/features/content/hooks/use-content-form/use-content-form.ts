import { useState } from "react";
import type { InputMethod } from "~/features/content/components";
import type { PdfData } from "../use-pdf-handler";

export function useContentForm() {
  const [inputMethod, setInputMethod] = useState<InputMethod>("text");
  const [inputText, setInputText] = useState("");

  const handleInputMethodChange = (method: InputMethod) => {
    setInputMethod(method);
    setInputText("");
  };

  const handleInputTextChange = (text: string) => {
    setInputText(text);
  };

  const updateInputTextFromPdf = (fileName: string, fileSize: string) => {
    setInputText(`PDFファイル: ${fileName} (${fileSize} KB)`);
  };

  const isFormValid = (pdfData?: PdfData | null) => {
    if (!inputText) return false;
    if (inputMethod === "pdf" && !pdfData) return false;
    return true;
  };

  const resetForm = () => {
    setInputMethod("text");
    setInputText("");
  };

  return {
    inputMethod,
    inputText,
    handleInputMethodChange,
    handleInputTextChange,
    updateInputTextFromPdf,
    isFormValid,
    resetForm,
  };
}