import { CreditCard, CheckCircle2, Edit3, FileText, Check } from "lucide-react";

export type OutputFormatCardProps = {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: keyof typeof ICON_MAP;
};

const ICON_MAP = {
  flashcard: CreditCard,
  multipleChoice: CheckCircle2,
  fillInTheBlank: Edit3,
  essay: FileText,
} as const;

export function OutputFormatCard({
  title,
  description,
  isSelected,
  onClick,
  icon,
}: OutputFormatCardProps) {
  const IconComponent = icon ? ICON_MAP[icon] : CreditCard;

  return (
    <button
      type="button"
      className={`relative group p-5 rounded border cursor-pointer transition-all duration-300 text-left overflow-hidden ${
        isSelected
          ? "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg shadow-violet-100/50 scale-[1.02]"
          : "border-gray-200 bg-white/80 backdrop-blur-sm hover:border-violet-200 hover:shadow-md hover:shadow-gray-100/50 hover:bg-white/90"
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {/* 選択状態のチェックマーク */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* アイコン */}
      <div
        className={`w-10 h-10 rounded flex items-center justify-center mb-3 transition-all duration-300 ${
          isSelected
            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
            : "bg-gray-100 text-gray-500 group-hover:bg-violet-100 group-hover:text-violet-600"
        }`}
      >
        <IconComponent className="w-5 h-5" />
      </div>

      {/* タイトル */}
      <h3
        className={`font-semibold mb-2 transition-colors duration-300 ${
          isSelected
            ? "text-gray-800"
            : "text-gray-700 group-hover:text-gray-800"
        }`}
      >
        {title}
      </h3>

      {/* 説明 */}
      <p
        className={`text-sm leading-relaxed transition-colors duration-300 ${
          isSelected
            ? "text-gray-600"
            : "text-gray-500 group-hover:text-gray-600"
        }`}
      >
        {description}
      </p>

      {/* 選択時のグラデーション効果 */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-purple-600/5 pointer-events-none" />
      )}
    </button>
  );
}
