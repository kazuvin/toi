import { callAnthropic } from "@/utils/llm";
import {
  PostFeedbackBody,
  FeedbackResponse,
} from "@parrot-buddy/shared/src/schemas/ai/feedback";

export const getFeedback = async (
  { previousMessage, userMessage }: PostFeedbackBody,
  apiKey: string
): Promise<FeedbackResponse> => {
  const prompt = `あなたは英語の言語エキスパートです。以下のメッセージを分析し、JSONフォーマットで詳細なフィードバックを提供してください。
修正版の英文には日本語訳も併せて提供してください。

前回のメッセージ: ${previousMessage || "なし"}
ユーザーのメッセージ: ${userMessage}

以下の点に特に注意して、厳密にチェックしてください：
- 冠詞（a, an, the）の使用
- 時制の一貫性
- 主語と動詞の一致
- 前置詞の適切な使用
- 可算名詞・不可算名詞の区別
- 複数形・単数形の正確な使用
- 文の構造と並列性
- 句読点の適切な使用

問題が一つも見つからない場合は、すべてのスコア（overall.score, grammar.score, context.score）に100点を付けてください。
問題がある場合のみ、適切なスコアを付けてください。
また、問題がない場合（スコアが100点の場合）は、improvementsのcorrectedMessageは返さないでください。

以下のJSON構造でフィードバックを提供してください：
{
  "overall": {
    "score": number (0-100),
    "summary": "全体的な評価の要約"
  },
  "grammar": {
    "score": number (0-100),
    "issues": [
      {
        "type": "grammar" | "vocabulary" | "punctuation" | "spelling",
        "description": "問題点の説明",
        "correction": {
          "en": "修正版（英語）",
          "ja": "修正版（日本語訳）"
        },
      }
    ],
  },
  "context": {
    "score": number (0-100),
    "comments": "文脈と自然さに関するコメント"
  },
  "improvements": {
    "correctedMessage": {
      "en": "メッセージの完全な修正版（英語）",
      "ja": "メッセージの完全な修正版（日本語訳）"
    },
    "alternativePhrasings": [
      {
        "en": "同じ考えを表現する別の方法（英語）",
        "ja": "同じ考えを表現する別の方法（日本語訳）"
      }
    ]
  }
}

レスポンスは有効なJSONであり、上記の構造に正確に従っていることを確認してください。
修正版の英文には、必ず日本語訳も提供してください。`;

  const response = await callAnthropic(prompt, apiKey);

  try {
    const feedback = JSON.parse(response);
    return feedback as FeedbackResponse;
  } catch (error) {
    console.error("Error parsing feedback response:", error);
    throw new Error("Failed to parse feedback response");
  }
};
