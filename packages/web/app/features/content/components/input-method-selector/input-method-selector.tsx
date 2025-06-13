import { Type, Upload, Globe, Youtube } from "lucide-react";

export type InputMethod = "text" | "file" | "website" | "youtube";

type InputMethodSelectorProps = {
  selectedMethod: InputMethod;
  onMethodChange: (method: InputMethod) => void;
};

export function InputMethodSelector({
  selectedMethod,
  onMethodChange,
}: InputMethodSelectorProps) {
  const inputMethods = [
    {
      id: "text" as const,
      label: "テキスト入力",
      icon: Type,
      description: "直接テキストを入力",
    },
    {
      id: "file" as const,
      label: "ファイル",
      icon: Upload,
      description: "ファイルをアップロード",
    },
    {
      id: "website" as const,
      label: "Webサイト",
      icon: Globe,
      description: "URLから取得",
    },
    {
      id: "youtube" as const,
      label: "YouTube",
      icon: Youtube,
      description: "動画から取得",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 touch-pan-y">
      {inputMethods.map((method) => {
        const Icon = method.icon;
        const isActive = selectedMethod === method.id;
        return (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded border border-border transition-all duration-200 ${
              isActive
                ? "bg-violet-100 text-violet-600 "
                : "bg-white/50 text-gray-500 hover:bg-white/80 hover:text-gray-700"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{method.label}</span>
          </button>
        );
      })}
    </div>
  );
}
