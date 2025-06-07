import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Globe, Sparkles, Upload, Type, Youtube } from "lucide-react";
import { OutputFormatList } from "~/features/content/components/output-format-list";
import { useOutputFormats } from "~/features/content/hooks/use-output-formats";
import { useFileHandler } from "~/features/content/hooks/use-file-handler";
import { useContentCreation } from "~/features/content/hooks/use-content-creation";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Toi" }, { name: "description", content: "Toi" }];
};

type InputMethod = "text" | "file" | "website" | "youtube";

export default function ContentNew() {
  const [inputMethod, setInputMethod] = useState<InputMethod>("text");

  const {
    outputFormats,
    toggleOutputFormat,
    hasSelectedFormats,
    getSelectedFormats,
  } = useOutputFormats();
  const { inputText, setInputText, handleFileUpload } = useFileHandler();
  const { isLoading, createContent } = useContentCreation();

  const handleCreateContent = async () => {
    const selectedFormats = getSelectedFormats();
    await createContent(inputText, selectedFormats);
  };

  const inputMethods = [
    {
      id: "text" as const,
      label: "自由入力",
      icon: Type,
      description: "テキストを直接入力",
    },
    {
      id: "file" as const,
      label: "ファイル選択",
      icon: Upload,
      description: "ファイルから読み込み",
    },
    {
      id: "website" as const,
      label: "Webサイト",
      icon: Globe,
      description: "WebサイトのURLから読み込み",
    },
    {
      id: "youtube" as const,
      label: "YouTube",
      icon: Youtube,
      description: "YouTube動画から読み込み",
    },
  ];

  const placeholderExamples = {
    text: `例：学習したい内容を入力してください...

💡 JavaScript の変数宣言について
📊 データベースの正規化とは何か
🎯 マーケティングの4P理論
🏛️ 第二次世界大戦の背景と経過`,
    file: "講義資料、PDF、テキストファイルから自動で学習コンテンツを作成",
    website: "例：https://example.com",
    youtube: "例：https://www.youtube.com/watch?v=video_id",
  };

  const renderInputArea = () => {
    switch (inputMethod) {
      case "text":
        return (
          <textarea
            placeholder={placeholderExamples.text}
            className="w-full h-72 p-6 rounded-2xl border border-border resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 bg-white dark:bg-gray-900 text-sm md:text-base leading-relaxed"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        );
      case "file":
        return (
          <div className="rounded-2xl border-2 border-dashed border-border bg-white dark:bg-gray-900 h-72">
            {inputText ? (
              <textarea
                className="w-full h-full p-6 resize-none focus:outline-none bg-transparent text-foreground placeholder-muted-foreground text-sm md:text-base leading-relaxed rounded-2xl"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={placeholderExamples.file}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    ファイルを選択
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {placeholderExamples.file}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <span>対応形式:</span>
                    <span className="font-bold">.txt .md .csv</span>
                  </div>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.csv"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  className="rounded-lg px-6 py-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  ファイルを選択
                </Button>
              </div>
            )}
          </div>
        );
      case "website":
        return (
          <div className="rounded-2xl border border-border bg-white dark:bg-gray-900 h-72">
            <div className="w-full h-full flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    WebサイトのURL
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    学習したいWebサイトのURLを入力してください
                  </p>
                </div>
              </div>
              <input
                type="url"
                placeholder={placeholderExamples.website}
                className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-800 text-sm md:text-base"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </div>
        );
      case "youtube":
        return (
          <div className="rounded-2xl border border-border bg-white dark:bg-gray-900 h-72">
            <div className="w-full h-full flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    YouTube動画のURL
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    学習したいYouTube動画のURLを入力してください
                  </p>
                </div>
              </div>
              <input
                type="url"
                placeholder={placeholderExamples.youtube}
                className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white dark:bg-gray-800 text-sm md:text-base"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col flex-1 gap-12 items-center justify-center mx-auto max-w-5xl w-full py-16 px-4 md:px-6">
        {/* ヒーローセクション */}
        <div className="text-center space-y-8 max-w-4xl">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              学習コンテンツを
              <br />
              <span className="text-violet-600 dark:text-violet-400">
                AIで自動生成
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              テキストやファイルを入力するだけで、AIが
              <span className="text-violet-600 dark:text-violet-400 font-medium">
                要約
              </span>
              ・
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                暗記カード
              </span>
              ・
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                問題集
              </span>
              など様々な学習形式に変換します
            </p>
          </div>

          {/* ユーザー情報とプラン */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 text-sm py-2 px-4 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-emerald-700 dark:text-emerald-300">
                無料プラン
              </span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="w-full flex flex-col items-center gap-8">
          {/* ステップ1: 入力カード */}
          <div className="w-full">
            <div className="p-6 md:p-8 rounded border border-border bg-white dark:bg-gray-800 space-y-6">
              {/* カードタイトル */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  学習したい内容を入力
                </h2>
              </div>

              {/* 入力形式選択タブ */}
              <div className="border border-border rounded-xl bg-gray-50 dark:bg-gray-700 p-1">
                <div className="flex">
                  {inputMethods.map((method) => {
                    const Icon = method.icon;
                    const isActive = inputMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setInputMethod(method.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                          isActive
                            ? "bg-white dark:bg-gray-800 text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 入力エリア */}
              <div>{renderInputArea()}</div>
            </div>
          </div>

          {/* ステップ2: 出力形式選択カード */}
          <div className="w-full">
            <div className="p-6 md:p-8 rounded border border-border bg-white dark:bg-gray-800 space-y-6">
              {/* カードタイトル */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  作成する学習コンテンツを選択
                </h2>
              </div>

              {/* 出力形式選択 */}
              <div>
                <OutputFormatList
                  outputFormats={outputFormats}
                  onToggleFormat={toggleOutputFormat}
                />
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div>
          <Button
            variant="default"
            size="lg"
            disabled={!inputText || !hasSelectedFormats || isLoading}
            className="rounded-lg px-8 py-3 text-base font-medium transition-all duration-200 bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
            onClick={handleCreateContent}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AIが学習コンテンツを作成中...</span>
              </div>
            ) : (
              <span>AIで学習コンテンツを生成する</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
