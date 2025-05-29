import { callAnthropic } from "@/utils/llm";
import {
  ExplainHistoryResponse,
  ExplainContent,
  ExplainResponse,
} from "@toi/shared";
import { drizzle } from "drizzle-orm/d1";
import { explainHistory } from "../../db/schemas";
import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";

/**
 * 英語表現の説明を生成するプロンプトを作成する
 * @param expression 英語表現
 * @returns プロンプト
 */
function createPrompt(expression: string): string {
  return `以下の英語表現「${expression}」について説明してください。

以下の形式のJSONで回答してください。余計な説明や文字は一切含めないでください：
{
  "translation": "日本語訳",
  "pronunciation": "${expression}"の発音記号",
  "grammar": "${expression}"の文法解説（必ず日本語で）",
  "usage": "${expression}"の実際の用法（必ず日本語で）",
  "examples": [
    {
      "english": "This is an example sentence.",
      "japanese": "これは例文です。"
    },
    {
      "english": "Here's another example.",
      "japanese": "これは別の例文です。"
    },
    {
      "english": "And one more example.",
      "japanese": "そしてもう1つの例文です。"
    }
  ]
}

注意事項：
1. 必ず有効なJSON形式で返してください
2. 文字列内にダブルクォートを含む場合は、エスケープしてください
3. 改行は含めないでください
4. 日本語文字列はそのまま使用してください（エスケープ不要）
5. examples は最低3つの例文を含めてください
6. examples の各要素は必ず english と japanese の両方を含めてください`;
}

/**
 * Anthropic API のレスポンスをパースする
 * @param content レスポンスのテキスト
 * @returns パースされたレスポンス
 */
function parseExplainContent(content: string): ExplainContent {
  try {
    return JSON.parse(content) as ExplainContent;
  } catch (error) {
    throw new Error("Failed to parse Claude's response as JSON");
  }
}

/**
 * 英語表現の説明を生成する
 * @param apiKey Anthropic APIキー
 * @param uid ユーザーID（オプション）
 * @param db D1データベースインスタンス（オプション）
 * @returns 説明
 */
export async function explainExpression(
  expression: string,
  apiKey: string,
  uid: string,
  db: D1Database
): Promise<ExplainResponse> {
  const prompt = createPrompt(expression);
  const content = await callAnthropic(prompt, apiKey);
  const result = parseExplainContent(content);

  // ユーザーIDとデータベースが提供されている場合、履歴を保存する
  const history = await saveExplainHistory(
    uid,
    expression,
    JSON.stringify(result),
    db
  );

  return history;
}

/**
 * 英語表現の説明履歴を保存する
 * @param uid ユーザーID
 * @param expression 英語表現
 * @param explanation 説明（JSON文字列）
 * @param db D1データベースインスタンス
 */
export async function saveExplainHistory(
  uid: string,
  expression: string,
  explanation: string,
  db: D1Database
): Promise<ExplainResponse> {
  const drizzleDb = drizzle(db);
  const id = uuidv4();

  const result = await drizzleDb
    .insert(explainHistory)
    .values({
      id: id,
      uid: uid,
      expression,
      explanation,
    })
    .returning();

  const history = {
    id: result[0].id,
    expression: result[0].expression,
    explanation: parseExplainContent(result[0].explanation),
    createdAt: result[0].createdAt,
  };

  return history;
}

/**
 * ユーザーの英語表現の説明履歴を取得する
 * @param uid ユーザーID
 * @param db D1データベースインスタンス
 * @returns 説明履歴の配列
 */
export async function getExplainHistory(
  uid: string,
  db: D1Database
): Promise<ExplainHistoryResponse> {
  const drizzleDb = drizzle(db);
  const result = await drizzleDb
    .select()
    .from(explainHistory)
    .where(sql`uid = ${uid}`)
    .orderBy(sql`created_at DESC`);

  return result.map((item) => ({
    id: item.id,
    expression: item.expression,
    explanation: parseExplainContent(item.explanation),
    createdAt: item.createdAt,
  }));
}

/**
 * 特定のIDの説明履歴を取得する
 * @param id 説明履歴のID
 * @param uid ユーザーID
 * @param db D1データベースインスタンス
 * @returns 説明履歴の配列
 */
export async function getExplainHistoryById(
  id: string,
  uid: string,
  db: D1Database
): Promise<ExplainResponse> {
  const drizzleDb = drizzle(db);
  const result = await drizzleDb
    .select()
    .from(explainHistory)
    .where(sql`id = ${id} AND uid = ${uid}`)
    .limit(1);

  const history = {
    id: result[0].id,
    expression: result[0].expression,
    explanation: parseExplainContent(result[0].explanation),
    createdAt: result[0].createdAt,
  };

  return history;
}
