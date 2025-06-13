import { Link } from "@remix-run/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { GetSourcesResponse } from "@toi/shared/src/schemas/source";

export type ContentListProps = {
  contents: GetSourcesResponse;
  isLoading?: boolean;
};

export function ContentList({ contents, isLoading = false }: ContentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="h-48 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="mt-auto h-10 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          まだコンテンツがありません
        </p>
        <Button asChild>
          <Link to="/content/new">新しいコンテンツを作る</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((content) => (
        <Card key={content.id} className="h-48 p-6 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold mb-2 line-clamp-2">
              {content.title || "無題"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {content.content}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{content.type}</span>
              {content.isFlashcardGenerated && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  フラッシュカード生成済み
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link to={`/content/${content.id}`}>詳細</Link>
            </Button>
            {content.isFlashcardGenerated && (
              <Button size="sm" asChild className="flex-1">
                <Link to={`/content/${content.id}/flashcards`}>学習</Link>
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}