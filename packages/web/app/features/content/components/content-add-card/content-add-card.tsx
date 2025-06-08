import { Plus } from "lucide-react";

export type ContentAddCardProps = {
  title: string;
  onClick: () => void;
};

export function ContentAddCard({ title, onClick }: ContentAddCardProps) {
  return (
    <button
      className="h-64 p-6 rounded border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-ring/50 transition-colors"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Plus className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-md text-muted-foreground mb-2">{title}</h3>
    </button>
  );
}
