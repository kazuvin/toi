import { DrizzleD1Database } from "drizzle-orm/d1";
import { source } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { callAnthropic } from "../utils/llm";

export const generateTitle = async (
  db: DrizzleD1Database,
  sourceId: string,
  apiKey: string
): Promise<string> => {
  // ソースの取得
  const sourceData = await db
    .select()
    .from(source)
    .where(eq(source.id, sourceId))
    .limit(1);

  if (!sourceData || sourceData.length === 0) {
    throw new Error("Source not found");
  }

  const prompt = `
<task>
  <description>
    以下のテキストから、適切なタイトルを生成してください。
    テキストの内容を簡潔に表現し、かつ魅力的なタイトルを考えてください。
  </description>

  <input>
    <text>${sourceData[0].content}</text>
  </input>

  <rules>
    <rule>タイトルは20文字以内で、日本語で出力してください。</rule>
    <rule>出力はタイトルのみとすること</rule>
  </rules>

  <output_format>
    "タイトルの文字列のみ"
  </output_format>
</task>`;

  const generatedTitle = await callAnthropic(prompt, apiKey);

  // タイトルをデータベースに更新
  await db
    .update(source)
    .set({ title: generatedTitle })
    .where(eq(source.id, sourceId));

  return generatedTitle;
};
