import { ContentDetail } from "~/features/content/components";
import { redirect, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "コンテンツ詳細 - Toi" },
    { 
      name: "description", 
      content: "コンテンツの詳細情報とフラッシュカードを表示します。"
    }
  ];
};

export async function clientLoader({ params }: { params: { id: string } }) {
  const { id } = params;
  return redirect(`/content/${id}/flashcards`);
}

export default function ContentDetailPage() {
  return <ContentDetail />;
}
