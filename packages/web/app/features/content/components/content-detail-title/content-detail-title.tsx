import { Spinner } from "~/components/ui/spinner/spinner";

type ContentDetailTitleProps = {
  title?: string;
  isLoading?: boolean;
};

export function ContentDetailTitle({
  title,
  isLoading,
}: ContentDetailTitleProps) {
  return (
    <h1 className="text-xl font-bold">
      {title || (
        <span className="flex items-center gap-sm text-muted-foreground">
          <Spinner size="sm" />
          {isLoading && "生成中..."}
        </span>
      )}
    </h1>
  );
}
