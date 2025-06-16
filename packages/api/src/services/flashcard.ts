import { DrizzleD1Database } from "drizzle-orm/d1";
import { source, flashcard } from "@/db/schemas";
import { eq, desc } from "drizzle-orm";
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
    .where(eq(flashcard.sourceId, sourceId))
    .orderBy(desc(flashcard.createdAt));
};

/**
 * フラッシュカードを更新する
 */
export const updateFlashcard = async (
  db: DrizzleD1Database,
  flashcardId: string,
  question: string,
  answer: string
) => {
  const [updatedFlashcard] = await db
    .update(flashcard)
    .set({
      question,
      answer,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(flashcard.id, flashcardId))
    .returning();

  if (!updatedFlashcard) {
    throw new Error("Flashcard not found");
  }

  return updatedFlashcard;
};

/**
 * フラッシュカードを一括更新する
 */
export const updateFlashcardsBulk = async (
  db: DrizzleD1Database,
  sourceId: string,
  flashcards: Array<{ id: string; question: string; answer: string }>
) => {
  const updatedFlashcards = [];
  const now = new Date().toISOString();

  for (const card of flashcards) {
    const [updatedFlashcard] = await db
      .update(flashcard)
      .set({
        question: card.question,
        answer: card.answer,
        updatedAt: now,
      })
      .where(eq(flashcard.id, card.id))
      .returning();

    if (updatedFlashcard) {
      updatedFlashcards.push(updatedFlashcard);
    }
  }

  return updatedFlashcards;
};
