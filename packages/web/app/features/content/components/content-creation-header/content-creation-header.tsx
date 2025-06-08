import { BookOpen } from "lucide-react";

export function ContentCreationHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center ">
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">
          AIで学習コンテンツを作成
        </h1>
        <p className="text-gray-600">
          フラッシュカード、選択問題、穴埋め問題、作文などを作成できます
        </p>
      </div>
    </div>
  );
}
