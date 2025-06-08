import { Button } from "~/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type ContentInputSectionProps = {
  content?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
};

export function ContentInputSection({
  content,
  isExpanded,
  onToggleExpanded,
}: ContentInputSectionProps) {
  return (
    <div className="p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col gap-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">入力</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              ソースを表示
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>ソース表示</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 pr-2">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {content || "コンテンツがありません"}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        <p
          className={`text-sm text-muted-foreground transition-all duration-300 ease-in-out ${
            !isExpanded ? "line-clamp-3" : ""
          }`}
        >
          {content}
        </p>
      </div>
      <div className="flex items-center justify-center mt-md">
        <Button variant="outline" size="icon" onClick={onToggleExpanded}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
