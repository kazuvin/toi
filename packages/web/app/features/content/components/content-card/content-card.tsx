import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner/spinner";

export type ContentCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isGenerating?: boolean;
  to: string;
};

export function ContentCard({
  title,
  description,
  icon,
  isGenerating = false,
  to,
}: ContentCardProps) {
  return (
    <div className="h-64 p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col">
      {icon}
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button
        variant="outline"
        className="mt-auto"
        disabled={isGenerating}
        asChild
      >
        <Link to={to}>
          {isGenerating ? (
            <>
              <Spinner size="sm" />
              生成中...
            </>
          ) : (
            "はじめる"
          )}
        </Link>
      </Button>
    </div>
  );
}
