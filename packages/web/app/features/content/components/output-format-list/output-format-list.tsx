import { OutputFormatCard } from "../output-format-card";
import type {
  OutputFormats,
  OutputFormatType,
} from "../../hooks/use-output-formats";

type OutputFormatListProps = {
  outputFormats: OutputFormats;
  onToggleFormat: (format: OutputFormatType) => void;
};

const OUTPUT_FORMAT_CONFIG = [
  {
    key: "flashcard" as const,
    title: "フラッシュカード",
    description: "単語や概念を覚えるためのカード形式",
  },
  {
    key: "multipleChoice" as const,
    title: "選択問題",
    description: "複数の選択肢から正解を選ぶ形式",
  },
  {
    key: "fillInTheBlank" as const,
    title: "空欄補充",
    description: "問題文の空欄を埋める形式",
  },
  {
    key: "essay" as const,
    title: "記述問題",
    description: "自由に回答を記述する形式",
  },
];

export function OutputFormatList({
  outputFormats,
  onToggleFormat,
}: OutputFormatListProps) {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {OUTPUT_FORMAT_CONFIG.map((format) => (
        <OutputFormatCard
          key={format.key}
          title={format.title}
          description={format.description}
          isSelected={outputFormats[format.key]}
          onClick={() => onToggleFormat(format.key)}
        />
      ))}
    </div>
  );
}
