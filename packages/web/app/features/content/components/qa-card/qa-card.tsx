import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";

type PresetItem = {
  label: string;
  opponentRole: string;
  myRole: string;
  content: string;
};

const PRESETS: PresetItem[] = [
  {
    label: "先生として生徒に教える",
    opponentRole: "生徒",
    myRole: "先生",
    content: "教科書の内容について理解を深めるための質疑応答を行います。",
  },
  {
    label: "面接で質問を受ける",
    opponentRole: "面接官",
    myRole: "応募者",
    content: "転職面接において、スキルや経験について質問を受けます。",
  },
];

export function QaCard() {
  const [opponentRole, setOpponentRole] = useState("");
  const [myRole, setMyRole] = useState("");
  const [content, setContent] = useState("");

  function handlePresetClick(preset: PresetItem) {
    setOpponentRole(preset.opponentRole);
    setMyRole(preset.myRole);
    setContent(preset.content);
  }

  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">AI 質疑応答</h3>
          <p className="text-gray-600 leading-relaxed">
            AIとの対話で理解を深める学習体験
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">
            プリセットから選択
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => handlePresetClick(preset)}
                className="h-auto p-4 text-left justify-start hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {preset.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {preset.myRole} ↔ {preset.opponentRole}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-base font-semibold text-gray-900">役割設定</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="my-role"
                className="text-sm font-medium text-gray-700"
              >
                あなたの役割
              </Label>
              <Input
                id="my-role"
                placeholder="例: 学生、質問者、応募者"
                value={myRole}
                onChange={(e) => setMyRole(e.target.value)}
                className="h-11 transition-colors focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="opponent-role"
                className="text-sm font-medium text-gray-700"
              >
                相手の役割
              </Label>
              <Input
                id="opponent-role"
                placeholder="例: 先生、専門家、面接官"
                value={opponentRole}
                onChange={(e) => setOpponentRole(e.target.value)}
                className="h-11 transition-colors focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="content"
            className="text-sm font-medium text-gray-700"
          >
            質疑応答の内容・目的
          </Label>
          <textarea
            id="content"
            placeholder="質疑応答の内容や目的を詳しく入力してください..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            質疑応答を開始
          </Button>
        </div>
      </div>
    </Card>
  );
}
