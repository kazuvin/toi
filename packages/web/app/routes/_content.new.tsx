import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { ClipboardList, Sparkles, Upload } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type OutputFormatCardProps = {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

export function OutputFormatCard({
  title,
  description,
  isSelected,
  onClick,
}: OutputFormatCardProps) {
  return (
    <button
      type="button"
      className={`p-6 rounded border cursor-pointer transition-all duration-200 text-left ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-ring/50 bg-card/30 backdrop-blur-sm"
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

export default function ContentNew() {
  const [inputText, setInputText] = useState("");
  const [outputFormats, setOutputFormats] = useState({
    flashcard: false,
    multipleChoice: false,
    fillInTheBlank: false,
    essay: false,
  });

  const toggleOutputFormat = (format: keyof typeof outputFormats) => {
    setOutputFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

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
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setInputText(text);
                  } catch (err) {
                    console.error(
                      "クリップボードからの読み取りに失敗しました:",
                      err
                    );
                  }
                }}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">
                  クリップボードからペースト
                </span>
              </Button>
            )}
          </div>
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <OutputFormatCard
            title="フラッシュカード"
            description="単語や概念を覚えるためのカード形式"
            isSelected={outputFormats.flashcard}
            onClick={() => toggleOutputFormat("flashcard")}
          />
          <OutputFormatCard
            title="選択問題"
            description="複数の選択肢から正解を選ぶ形式"
            isSelected={outputFormats.multipleChoice}
            onClick={() => toggleOutputFormat("multipleChoice")}
          />
          <OutputFormatCard
            title="空欄補充"
            description="問題文の空欄を埋める形式"
            isSelected={outputFormats.fillInTheBlank}
            onClick={() => toggleOutputFormat("fillInTheBlank")}
          />
          <OutputFormatCard
            title="記述問題"
            description="自由に回答を記述する形式"
            isSelected={outputFormats.essay}
            onClick={() => toggleOutputFormat("essay")}
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="lg"
        disabled={!inputText || Object.values(outputFormats).every((v) => !v)}
        className="!rounded"
      >
        <Sparkles className="w-4 h-4" />
        学習コンテンツを作成する
      </Button>
    </div>
  );
}
