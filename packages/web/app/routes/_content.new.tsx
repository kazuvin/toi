import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { ClipboardList, Sparkles, Upload } from "lucide-react";
import { OutputFormatList } from "~/features/content/components/output-format-list";
import { useOutputFormats } from "~/features/content/hooks/use-output-formats";
import { useFileHandler } from "~/features/content/hooks/use-file-handler";
import { useContentCreation } from "~/features/content/hooks/use-content-creation";

export const meta: MetaFunction = () => {
  return [{ title: "Toi" }, { name: "description", content: "Toi" }];
};

export default function ContentNew() {
  const {
    outputFormats,
    toggleOutputFormat,
    hasSelectedFormats,
    getSelectedFormats,
  } = useOutputFormats();
  const {
    inputText,
    setInputText,
    handleFileUpload,
    handlePasteFromClipboard,
  } = useFileHandler();
  const { isLoading, createContent } = useContentCreation();

  const handleCreateContent = async () => {
    const selectedFormats = getSelectedFormats();
    await createContent(inputText, selectedFormats);
  };

  return (
    <div className="flex flex-col flex-1 gap-8 items-center justify-center mx-auto max-w-4xl w-full mb-lg">
      <h1 className="text-4xl font-bold bg-accent-gradient bg-clip-text text-transparent">
        こんにちは、Kazuvin
      </h1>
      <div className="text-sm py-2 px-4 rounded-full border border-border text-muted-foreground backdrop-blur-sm">
        無料プラン
      </div>
      <div className="w-full flex flex-col items-center gap-md">
        <div className="relative w-full max-w-4xl">
          <textarea
            placeholder="テキストを入力、ファイルをドラッグ＆ドロップ"
            className="w-full h-56 p-md rounded border border-border resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".txt,.md,.csv"
            />
            <Button
              variant="outline"
              size="sm"
              className="!rounded !px-2 sm:!px-4"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">ファイルをアップロード</span>
            </Button>
            {!inputText && (
              <Button
                variant="outline"
                size="sm"
                className="!rounded !px-2 sm:!px-4"
                onClick={handlePasteFromClipboard}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">
                  クリップボードからペースト
                </span>
              </Button>
            )}
          </div>
        </div>
        <OutputFormatList
          outputFormats={outputFormats}
          onToggleFormat={toggleOutputFormat}
        />
      </div>
      <Button
        variant="outline"
        size="lg"
        disabled={!inputText || !hasSelectedFormats || isLoading}
        className="!rounded"
        onClick={handleCreateContent}
      >
        <Sparkles className="w-4 h-4" />
        {isLoading ? "作成中..." : "学習コンテンツを作成する"}
      </Button>
    </div>
  );
}
