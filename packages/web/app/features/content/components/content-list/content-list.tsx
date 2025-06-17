import { Link } from "@remix-run/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { GetSourcesResponse } from "@toi/shared/src/schemas/source";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { deleteSource } from "~/services/sources";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Trash2, Edit } from "lucide-react";

export type ContentListProps = {
  contents: GetSourcesResponse;
  isLoading?: boolean;
};

export function ContentList({ contents, isLoading = false }: ContentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      await deleteSource(id);
      await mutate("/api/sources");
      toast.success(`「${title || "無題"}」を削除しました`);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("削除に失敗しました");
    } finally {
      setDeletingId(null);
    }
  };

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
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to={`/content/${content.id}`}>詳細</Link>
              </Button>
              {content.isFlashcardGenerated && (
                <Button size="sm" asChild className="flex-1">
                  <Link to={`/content/${content.id}/flashcards`}>学習</Link>
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={deletingId === content.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>コンテンツを削除</DialogTitle>
                    <DialogDescription>
                      「{content.title || "無題"}」を削除しますか？
                      <br />
                      この操作は取り消せません。関連するフラッシュカードも削除されます。
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">キャンセル</Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleDelete(content.id, content.title || "")}
                      disabled={deletingId === content.id}
                    >
                      {deletingId === content.id ? "削除中..." : "削除"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {content.isFlashcardGenerated && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/content/${content.id}/flashcards/edit`}>
                    <Edit className="w-4 h-4 mr-1" />
                    一括編集
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}