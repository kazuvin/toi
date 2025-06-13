import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { ContentList } from "~/features/content/components/content-list";
import { getSources } from "~/services/sources";
import { Button } from "~/components/ui/button";

export async function loader() {
  try {
    const sources = await getSources();
    return json({ sources });
  } catch (error) {
    console.error("Failed to load sources:", error);
    return json({ sources: [] });
  }
}

export default function ContentsPage() {
  const { sources } = useLoaderData<typeof loader>();

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
      <ContentList contents={sources} />
    </div>
  );
}