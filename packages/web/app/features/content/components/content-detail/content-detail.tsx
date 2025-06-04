import { Button } from "~/components/ui/button";
import { BookOpen, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "@remix-run/react";
import { Spinner } from "~/components/ui/spinner/spinner";
import { useContentDetail } from "../../hooks/use-content-detail";
import { ContentCard } from "../content-card";
import { ContentAddCard } from "../content-add-card";

export function ContentDetail() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();
  const { data } = useContentDetail(id);

  return (
    <div className="flex flex-col flex-1 gap-8 mx-auto max-w-4xl w-full mb-lg py-lg">
      <h1 className="text-xl font-bold">
        {data?.title || (
          <span className="flex items-center gap-sm text-muted-foreground">
            <Spinner size="sm" />
            {data && "生成中..."}
          </span>
        )}
      </h1>
      <div className="p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col gap-sm">
        <h2 className="font-bold">入力</h2>
        <div className="relative">
          <p
            className={`text-sm text-muted-foreground transition-all duration-300 ease-in-out ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            {data?.content}
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
          isGenerating={!data?.isFlashcardGenerated}
          icon={
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          }
          to={`/content/${id}/flashcards`}
        />
        <ContentCard
          title="選択問題"
          description="複数の選択肢から正解を選ぶ形式"
          icon={
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
          }
          to={`/content/${id}/questions`}
        />
        <ContentAddCard />
      </div>
    </div>
  );
}
