export type OutputFormatCardProps = {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

export function OutputFormatCard({
  title,
  description,
  isSelected,
  onClick,
}: OutputFormatCardProps) {
  return (
    <button
      type="button"
      className={`p-6 rounded border cursor-pointer transition-all duration-200 text-left ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-ring/50 bg-card/30 backdrop-blur-sm"
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
