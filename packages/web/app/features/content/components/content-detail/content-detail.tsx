import { BookOpen, CheckSquare } from "lucide-react";
import { useParams } from "@remix-run/react";
import { useContentDetail } from "../../hooks/use-content-detail";
import { useToggle } from "~/hooks";
import { ContentCard } from "../content-card";
import { ContentAddCard } from "../content-add-card";
import { ContentDetailTitle } from "../content-detail-title";
import { ContentInputSection } from "../content-input-section";

export function ContentDetail() {
  const { id } = useParams();
  const { data } = useContentDetail(id);
  const { value: isExpanded, toggle: toggleExpanded } = useToggle();

  return (
    <div className="flex flex-col flex-1 gap-8 mx-auto max-w-4xl w-full mb-lg py-lg">
      <ContentDetailTitle title={data?.title} isLoading={!!data} />
      <ContentInputSection
        content={data?.content}
        isExpanded={isExpanded}
        onToggleExpanded={toggleExpanded}
      />
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
