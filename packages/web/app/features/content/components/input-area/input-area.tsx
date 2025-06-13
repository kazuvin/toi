import { Upload, Globe, Youtube, Clipboard } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { InputMethod } from "../input-method-selector";

type InputAreaProps = {
  inputMethod: InputMethod;
  inputText: string;
  onInputTextChange: (text: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InputArea({
  inputMethod,
  inputText,
  onInputTextChange,
  onFileUpload,
}: InputAreaProps) {
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onInputTextChange(inputText + text);
    } catch (err) {
      console.error("クリップボードからの読み取りに失敗しました:", err);
    }
  };

  const renderInputArea = () => {
    switch (inputMethod) {
      case "text":
        return (
          <div className="w-full h-64 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden relative touch-pan-y">
            {!inputText && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePasteFromClipboard}
                className="absolute top-4 right-4 z-10 hidden sm:flex"
              >
                <Clipboard className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">クリップボードからペースト</span>
              </Button>
            )}
            <textarea
              placeholder="学習したい内容を入力してください..."
              className="w-full h-full p-6 pr-4 sm:pr-28 resize-none text-sm focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              value={inputText}
              onChange={(e) => onInputTextChange(e.target.value)}
            />
          </div>
        );
      case "file":
        return (
          <div className="w-full h-64 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
            {inputText ? (
              <textarea
                className="w-full h-full p-6 resize-none focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                value={inputText}
                onChange={(e) => onInputTextChange(e.target.value)}
                placeholder="ファイルの内容がここに表示されます..."
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-violet-600" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    ファイルをドラッグ&ドロップまたは選択
                  </p>
                  <div className="text-xs text-gray-500">
                    対応形式: .txt .md .csv
                  </div>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={onFileUpload}
                  accept=".txt,.md,.csv"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  className="mt-2"
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
          <div className="w-full h-64 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="h-full flex flex-col justify-start gap-6 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  WebサイトのURL
                </span>
              </div>
              <Input
                type="url"
                placeholder="https://example.com"
                value={inputText}
                onChange={(e) => onInputTextChange(e.target.value)}
              />
            </div>
          </div>
        );
      case "youtube":
        return (
          <div className="w-full h-64 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="h-full flex flex-col justify-start gap-6 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  YouTube動画のURL
                </span>
              </div>
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={inputText}
                onChange={(e) => onInputTextChange(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="w-full">{renderInputArea()}</div>;
}
