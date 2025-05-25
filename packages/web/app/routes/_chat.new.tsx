import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { useState } from "react";

function Card({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="w-full rounded bg-card p-6 transition-all duration-200">
      <div className="text-base font-semibold mb-4 text-foreground/90">
        {title}
      </div>
      {children}
    </div>
  );
}

function FormatOption({
  title,
  isSelected,
  onSelect,
}: {
  title: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`relative aspect-square p-4 rounded border cursor-pointer transition-all duration-200 w-full ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-input hover:border-primary/50 hover:bg-primary/5"
      }`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect();
        }
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <div
          className={`w-8 h-8 rounded flex items-center justify-center ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium text-center">{title}</span>
      </div>
    </button>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function ChatNew() {
  const [outputFormats, setOutputFormats] = useState({
    flashcard: false,
    multipleChoice: false,
    fillInTheBlank: false,
  });
  const [inputText, setInputText] = useState("");

  function handleFormatChange(format: keyof typeof outputFormats) {
    setOutputFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  }

  return (
    <div className="flex flex-col flex-1 gap-8 items-center mx-auto max-w-3xl bg-background mb-lg">
      <h1 className="text-4xl font-bold mt-8 bg-accent-gradient bg-clip-text text-transparent">
        こんにちは、Kazuvin
      </h1>
      <div className="mb-6 text-sm py-2 px-4 rounded-full border border-border text-muted-foreground bg-background/50 backdrop-blur-sm">
        無料プラン
      </div>
      <div className="mb-6 w-full max-w-4xl">
        <Card title="1. 入力方法を選択">
          <div className="flex items-center justify-center gap-8">
            <div className="flex-1">
              <div className="relative group">
                <textarea
                  placeholder="学習内容を入力..."
                  className="w-full h-56 rounded border border-input bg-background/50 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                {!inputText && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 !rounded transition-opacity duration-200"
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
                    クリップボードからペースト
                  </Button>
                )}
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">or</div>
            <div className="flex-1">
              <div className="w-full h-56 rounded-lg border-2 border-dashed border-input bg-background/50 p-4 flex items-center justify-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    ファイルをドラッグ＆ドロップ
                  </div>
                  <div className="text-sm text-muted-foreground">または</div>
                  <Button
                    variant="outline"
                    className="mt-3 hover:bg-primary/10"
                  >
                    ファイルを選択
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card title="2. 出力形式を選択">
        <div className="grid grid-cols-4 gap-4">
          <FormatOption
            title="フラッシュカード"
            isSelected={outputFormats.flashcard}
            onSelect={() => handleFormatChange("flashcard")}
          />
          <FormatOption
            title="四択問題"
            isSelected={outputFormats.multipleChoice}
            onSelect={() => handleFormatChange("multipleChoice")}
          />
          <FormatOption
            title="穴埋め問題"
            isSelected={outputFormats.fillInTheBlank}
            onSelect={() => handleFormatChange("fillInTheBlank")}
          />
        </div>
      </Card>
      <Button className="mt-4 px-8 py-2 text-base font-medium bg-primary hover:bg-primary/90 transition-colors duration-200">
        問題集を作る
      </Button>
    </div>
  );
}
