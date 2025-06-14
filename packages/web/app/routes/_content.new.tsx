import type { MetaFunction } from "@remix-run/node";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  InputMethodSelector,
  InputArea,
  ContentCreationHeader,
  PlanIndicator,
  ContentCreationButton,
  type InputMethod,
} from "~/features/content/components";
import { useFileHandler } from "~/features/content/hooks/use-file-handler";
import { useContentCreation } from "~/features/content/hooks/use-content-creation";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Toi" }, { name: "description", content: "Toi" }];
};

export default function ContentNew() {
  const [inputMethod, setInputMethod] = useState<InputMethod>("text");

  const { inputText, setInputText, handleFileUpload } = useFileHandler();
  const { isLoading, createContent } = useContentCreation();

  const handleCreateContent = async () => {
    // TODO: 出力形式を選択できるようにする
    await createContent(inputText, ["flashcard"], inputMethod);
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
                onMethodChange={setInputMethod}
              />

              {/* 入力エリア */}
              <InputArea
                inputMethod={inputMethod}
                inputText={inputText}
                onInputTextChange={setInputText}
                onFileUpload={handleFileUpload}
              />
            </CardContent>
          </Card>

          {/* 生成ボタン */}
          <ContentCreationButton
            disabled={!inputText || isLoading}
            isLoading={isLoading}
            onClick={handleCreateContent}
          />
        </div>
      </div>
    </div>
  );
}
