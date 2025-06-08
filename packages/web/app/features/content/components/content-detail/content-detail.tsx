import { BookOpen, FileText } from "lucide-react";
import { useParams } from "@remix-run/react";
import { useContentDetail } from "../../hooks/use-content-detail";
import { ContentCard } from "../content-card";
import { ContentDetailTitle } from "../content-detail-title";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function ContentDetail() {
  const { id } = useParams();
  const { data } = useContentDetail(id);

  return (
    <div className="flex flex-col flex-1 gap-8 mx-auto max-w-4xl w-full mb-lg py-lg">
      <ContentDetailTitle title={data?.title} isLoading={!!data} />

      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              入力ソースを表示
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>入力ソース</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {data?.content || "コンテンツがありません"}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-foreground">フラッシュカード</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ContentCard
            title="フラッシュカード"
            description="単語や概念を覚えるためのカード形式"
            isGenerating={!data?.isFlashcardGenerated}
            icon={
              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            }
            to={`/content/${id}/flashcards`}
          />
        </div>
      </div>
    </div>
  );
}
