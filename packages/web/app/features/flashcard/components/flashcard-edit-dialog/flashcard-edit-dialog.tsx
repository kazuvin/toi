import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mutate } from "swr";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { updateFlashcard } from "~/services/flashcard";
import { type PutFlashcardRequestBody } from "@toi/shared/src/schemas/source";

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

type FormValues = PutFlashcardRequestBody;

export function FlashcardEditDialog({
  isOpen,
  onClose,
  flashcard,
}: FlashcardEditDialogProps) {
  const formSchema = z.object({
    question: z.string().min(1, "質問は必須です"),
    answer: z.string().min(1, "回答は必須です"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: flashcard.question,
      answer: flashcard.answer,
    },
  });

  const { handleSubmit, formState: { isSubmitting }, reset, setError: setFormError } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      await updateFlashcard(flashcard.sourceId, flashcard.id, values);
      
      // SWRキャッシュを更新
      mutate(`/sources/${flashcard.sourceId}/flashcards`);
      
      onClose();
    } catch (err) {
      setFormError("root", {
        message: "フラッシュカードの更新に失敗しました"
      });
      console.error("Error updating flashcard:", err);
    }
  };

  const handleClose = () => {
    reset({
      question: flashcard.question,
      answer: flashcard.answer,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>フラッシュカードを編集</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>質問</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="質問を入力してください"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>回答</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="回答を入力してください"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.formState.errors.root && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {form.formState.errors.root.message}
              </div>
            )}
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}