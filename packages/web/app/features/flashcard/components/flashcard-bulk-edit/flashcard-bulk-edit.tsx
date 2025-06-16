import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2, Save, Trash2 } from "lucide-react";
import { updateFlashcardsBulk } from "~/services/flashcard";
import { toast } from "sonner";

export type FlashcardBulkEditData = {
  id: string;
  question: string;
  answer: string;
};

type FlashcardBulkEditProps = {
  sourceId: string;
  flashcards: FlashcardBulkEditData[];
  onUpdate: () => void;
};

export function FlashcardBulkEdit({ sourceId, flashcards, onUpdate }: FlashcardBulkEditProps) {
  const [editedFlashcards, setEditedFlashcards] = useState<FlashcardBulkEditData[]>(flashcards);
  const [isSaving, setIsSaving] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const handleFlashcardChange = (id: string, field: 'question' | 'answer', value: string) => {
    setEditedFlashcards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleDelete = (id: string) => {
    setDeletedIds(prev => new Set(prev).add(id));
  };

  const handleRestore = (id: string) => {
    setDeletedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    
    try {
      const cardsToUpdate = editedFlashcards
        .filter(card => !deletedIds.has(card.id))
        .filter(card => {
          const original = flashcards.find(f => f.id === card.id);
          return original && (original.question !== card.question || original.answer !== card.answer);
        });

      if (cardsToUpdate.length === 0) {
        toast.info('更新する項目がありません');
        return;
      }

      await updateFlashcardsBulk(sourceId, {
        flashcards: cardsToUpdate,
      });
      
      onUpdate();
      toast.success(`${cardsToUpdate.length}件のフラッシュカードを更新しました`);
    } catch (error) {
      console.error('Failed to update flashcards:', error);
      toast.error('フラッシュカードの更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (deletedIds.size > 0) return true;
    
    return editedFlashcards.some(card => {
      const original = flashcards.find(f => f.id === card.id);
      return original && (original.question !== card.question || original.answer !== card.answer);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">フラッシュカード一括編集</h1>
          <p className="text-muted-foreground">
            {flashcards.length}件のフラッシュカードを編集できます
          </p>
        </div>
        <Button 
          onClick={handleSaveAll}
          disabled={!hasChanges() || isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              すべて保存
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {editedFlashcards.map((card, index) => {
          const isDeleted = deletedIds.has(card.id);
          return (
            <Card 
              key={card.id} 
              className={`transition-opacity ${isDeleted ? 'opacity-50' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    フラッシュカード {index + 1}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isDeleted ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(card.id)}
                      >
                        復元
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${card.id}`}>質問</Label>
                  <Input
                    id={`question-${card.id}`}
                    value={card.question}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFlashcardChange(card.id, 'question', e.target.value)}
                    disabled={isDeleted}
                    placeholder="質問を入力してください"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`answer-${card.id}`}>回答</Label>
                  <Input
                    id={`answer-${card.id}`}
                    value={card.answer}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFlashcardChange(card.id, 'answer', e.target.value)}
                    disabled={isDeleted}
                    placeholder="回答を入力してください"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}