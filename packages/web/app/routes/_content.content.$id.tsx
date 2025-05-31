import { Button } from "~/components/ui/button";
import {
  BookOpen,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "@remix-run/react";
import useSWR, { mutate as globalMutate } from "swr";
import { getSourceById } from "~/services/sources";
import { Spinner } from "~/components/ui/spinner/spinner";
import { postTitle } from "~/services/source";
import { postFlashcard } from "~/services/flashcard";

type ContentCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isGenerating?: boolean;
  to: string;
};

function ContentCard({
  title,
  description,
  icon,
  isGenerating = false,
  to,
}: ContentCardProps) {
  return (
    <div className="h-64 p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col">
      {icon}
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button
        variant="outline"
        className="mt-auto"
        disabled={isGenerating}
        asChild
      >
        <Link to={to}>
          {isGenerating ? (
            <>
              <Spinner size="sm" />
              生成中...
            </>
          ) : (
            "はじめる"
          )}
        </Link>
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
  const { id } = useParams();
  const { data, mutate } = useSWR(
    id ? `/api/sources/${id}` : null,
    async () => {
      const response = await getSourceById(id!);
      return response;
    },
    {
      revalidateOnFocus: false,
      onSuccess: async (data) => {
        if (!data.title) {
          await postTitle({ sourceId: id! });
          mutate();
          globalMutate("/api/sources");
        }

        if (!data.isFlashcardGenerated) {
          await postFlashcard({ sourceId: id! });
          mutate();
        }
      },
    }
  );

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
