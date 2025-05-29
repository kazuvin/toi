import { Button } from "~/components/ui/button";
import {
  BookOpen,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
} from "lucide-react";
import { useState } from "react";

type ContentCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isGenerating?: boolean;
};

function ContentCard({
  title,
  description,
  icon,
  isGenerating = false,
}: ContentCardProps) {
  return (
    <div className="h-64 p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col">
      {icon}
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button variant="outline" className="mt-auto" disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            生成中...
          </>
        ) : (
          "はじめる"
        )}
      </Button>
    </div>
  );
}

function ContentAddCard() {
  return (
    <div className="h-64 p-6 rounded border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-ring/50 transition-colors">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Plus className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-md text-muted-foreground mb-2">コンテンツを追加</h3>
    </div>
  );
}

export default function ContentDetail() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col flex-1 gap-8 mx-auto max-w-4xl w-full mb-lg py-lg">
      <h1 className="text-xl font-bold">contents title</h1>
      <div className="p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col gap-sm">
        <h2 className="font-bold">入力</h2>
        <div className="relative">
          <p
            className={`text-sm text-muted-foreground transition-all duration-300 ease-in-out ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </div>
        <div className="flex items-center justify-center mt-md">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ContentCard
          title="フラッシュカード"
          description="単語や概念を覚えるためのカード形式"
          isGenerating={true}
          icon={
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          }
        />
        <ContentCard
          title="選択問題"
          description="複数の選択肢から正解を選ぶ形式"
          icon={
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
          }
        />
        <ContentAddCard />
      </div>
    </div>
  );
}
