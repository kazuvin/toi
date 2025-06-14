import { useState } from "react";

export type PdfData = {
  fileName: string;
  fileContent: string;
};

export function usePdfHandler() {
  const [pdfData, setPdfData] = useState<PdfData | null>(null);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return null;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Content = result.split(',')[1];
      
      const data: PdfData = {
        fileName: file.name,
        fileContent: base64Content,
      };
      
      setPdfData(data);
    };
    
    reader.onerror = () => {
      console.error("PDFファイルの読み込みに失敗しました");
      setPdfData(null);
    };
    
    reader.readAsDataURL(file);
    
    return {
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1),
    };
  };

  const clearPdfData = () => {
    setPdfData(null);
  };

  return {
    pdfData,
    handlePdfUpload,
    clearPdfData,
  };
}