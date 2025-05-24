import { callAnthropic } from "@/utils/llm";
import { SituationResponse } from "@parrot-buddy/shared/src/schemas/ai/situations";

export async function getSituations(
  { expression }: { expression: string },
  apiKey: string
): Promise<SituationResponse> {
  const prompt = `以下の表現「${expression}」をユーザーが実際に使用できるシチュエーションを3つ提案してください。
各シチュエーションは以下の形式のJSONで返してください：
{
  "situations": [
    {
      "title": "シチュエーションのタイトル",
      "aiRole": "AIの役割",
      "userRole": "ユーザーの役割（表現を使用する側の役割）",
      "situation": "シチュエーションの詳細な説明"
    }
  ]
}

シチュエーションは以下の条件を満たすようにしてください：
1. ユーザーが実際に表現を使用する側の役割になること (例: expression が "How can I help you?" の場合、aiRole: "お客様", userRole: "店員" というシチュエーションを提案すること。)
2. 実践的で日常的に使える場面であること
3. 自然な会話の流れの中で表現を使える場面であること
4. 文化的な違いや誤解を避ける場面であること
5. ユーザーが積極的に参加できる場面であること

JSONのみを返してください。`;

  const response = await callAnthropic(prompt, apiKey);

  return JSON.parse(response) as SituationResponse;
}
