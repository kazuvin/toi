import type { MetaFunction } from "@remix-run/node";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  InputMethodSelector,
  InputArea,
  ContentCreationHeader,
  PlanIndicator,
  ContentCreationButton,
} from "~/features/content/components";
import { 
  useFileHandler,
  useContentCreation,
  usePdfHandler,
  useYoutubeHandler,
  useContentForm,
} from "~/features/content/hooks";

export const meta: MetaFunction = () => {
  return [{ title: "Toi" }, { name: "description", content: "Toi" }];
};

export default function ContentNew() {
  const { handleFileUpload } = useFileHandler();
  const { isLoading, createContent } = useContentCreation();
  const { pdfData, handlePdfUpload } = usePdfHandler();
  const { youtubeData, handleYoutubeUrlChange } = useYoutubeHandler();
  const {
    inputMethod,
    inputText,
    handleInputMethodChange,
    handleInputTextChange,
    updateInputTextFromPdf,
    isFormValid,
  } = useContentForm();

  const handlePdfFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInfo = handlePdfUpload(event);
    if (fileInfo) {
      updateInputTextFromPdf(fileInfo.fileName, fileInfo.fileSize);
    }
  };

  const handleCreateContent = async () => {
    if (!isFormValid(pdfData, youtubeData)) return;

    if (inputMethod === "pdf" && pdfData) {
      await createContent(inputText, ["flashcard"], inputMethod, pdfData);
    } else if (inputMethod === "youtube" && youtubeData) {
      await createContent(inputText, ["flashcard"], inputMethod, undefined, youtubeData);
    } else {
      await createContent(inputText, ["flashcard"], inputMethod);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* ヘッダー */}
          <ContentCreationHeader />

          {/* プラン表示 */}
          <PlanIndicator />

          {/* 入力方法カード */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">
                入力方法を選択
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputMethodSelector
                selectedMethod={inputMethod}
                onMethodChange={handleInputMethodChange}
              />

              {/* 入力エリア */}
              <InputArea
                inputMethod={inputMethod}
                inputText={inputText}
                onInputTextChange={handleInputTextChange}
                onFileUpload={handleFileUpload}
                onPdfUpload={handlePdfFileUpload}
                onYoutubeUrlChange={handleYoutubeUrlChange}
              />
            </CardContent>
          </Card>

          {/* 生成ボタン */}
          <ContentCreationButton
            disabled={!isFormValid(pdfData, youtubeData) || isLoading}
            isLoading={isLoading}
            onClick={handleCreateContent}
          />
        </div>
      </div>
    </div>
  );
}
