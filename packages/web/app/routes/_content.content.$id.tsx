import { ContentDetail } from "~/features/content/components";
import { redirect } from "@remix-run/react";

export async function clientLoader({ params }: { params: { id: string } }) {
  const { id } = params;
  return redirect(`/content/${id}/flashcards`);
}

export default function ContentDetailPage() {
  return <ContentDetail />;
}
