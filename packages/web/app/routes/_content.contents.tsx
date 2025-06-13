import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContentList } from "~/features/content/components/content-list";
import { getSources } from "~/services/sources";
import { Button } from "~/components/ui/button";
import { GetSourcesResponse } from "@toi/shared/src/schemas/source";

export default function ContentsPage() {
  const [sources, setSources] = useState<GetSourcesResponse>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSources = async () => {
      try {
        setIsLoading(true);
        const data = await getSources();
        setSources(data);
      } catch (error) {
        console.error("Failed to load sources:", error);
        setSources([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSources();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">コンテンツ一覧</h1>
          <p className="text-muted-foreground mt-2">
            作成したコンテンツを確認・学習できます
          </p>
        </div>
        <Button asChild>
          <Link to="/content/new">新しいコンテンツを作る</Link>
        </Button>
      </div>
      <ContentList contents={sources} isLoading={isLoading} />
    </div>
  );
}