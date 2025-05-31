import { DrizzleD1Database } from "drizzle-orm/d1";
import { source, flashcard } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { callAnthropic } from "../utils/llm";
import { Flashcard } from "@toi/shared/src/schemas/source";

export const generateFlashcards = async (
  db: DrizzleD1Database,
  sourceId: string,
  apiKey: string
): Promise<Flashcard[]> => {
  // ソースの取得
  const sourceData = await db
    .select()
    .from(source)
    .where(eq(source.id, sourceId))
    .limit(1);

  if (!sourceData) {
    throw new Error("Source not found");
  }

  // AIを使用してフラッシュカードを生成
  const prompt = `
<task>
  <description>
    以下のテキストから、重要な概念や用語を抽出し、フラッシュカード形式（質問と回答）で作成してください。
    各フラッシュカードは、学習者が概念を理解し、記憶するのに役立つものであるべきです。
  </description>

  <input>
    <text>${sourceData[0].content}</text>
  </input>

  <rules>
    <rule>
      フラッシュカードは必ず <output_format> のJSON形式で出力してください：
    </rule>
  </rules>

  <output_format>
    {
      "flashcards": [
        {
          "question": "質問",
          "answer": "回答"
        }
      ]
    }
  </output_format>
</task>`;

  const response = await callAnthropic(prompt, apiKey);
  const parsedResponse = JSON.parse(response);
  const flashcards = parsedResponse.flashcards;

  // フラッシュカードをデータベースに保存
  const savedFlashcards = await Promise.all(
    flashcards.map(async (card: Flashcard) => {
      const [savedCard] = await db
        .insert(flashcard)
        .values({
          id: crypto.randomUUID(),
          sourceId,
          question: card.question,
          answer: card.answer,
        })
        .returning();
      return savedCard;
    })
  );

  return savedFlashcards;
};

/**
 * ソースIDに紐づくフラッシュカードの一覧を取得する
 */
export const getFlashcardsBySourceId = async (
  db: DrizzleD1Database,
  sourceId: string
) => {
  return await db
    .select()
    .from(flashcard)
    .where(eq(flashcard.sourceId, sourceId));
};
