import { useState } from "react";
import { mutate } from "swr";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { updateFlashcard } from "~/services/flashcard";
import { PutFlashcardRequestBody } from "@toi/shared/src/schemas/source";

type FlashcardEditDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  flashcard: {
    id: string;
    sourceId: string;
    question: string;
    answer: string;
  };
};

export function FlashcardEditDialog({
  isOpen,
  onClose,
  flashcard,
}: FlashcardEditDialogProps) {
  const [question, setQuestion] = useState(flashcard.question);
  const [answer, setAnswer] = useState(flashcard.answer);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim()) {
      setError("質問と回答は必須です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body: PutFlashcardRequestBody = {
        question: question.trim(),
        answer: answer.trim(),
      };

      await updateFlashcard(flashcard.sourceId, flashcard.id, body);
      
      // SWRキャッシュを更新
      mutate(`/sources/${flashcard.sourceId}/flashcards`);
      
      onClose();
    } catch (err) {
      setError("フラッシュカードの更新に失敗しました");
      console.error("Error updating flashcard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>フラッシュカードを編集</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">質問</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="質問を入力してください"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">回答</Label>
            <Input
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="回答を入力してください"
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}