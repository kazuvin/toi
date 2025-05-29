import { PostTextToSpeechResponse } from "@toi/shared/src/schemas/ai/text-to-speech";

export const textToSpeech = async (
  apiKey: string,
  text: string,
  language: string
): Promise<PostTextToSpeechResponse> => {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: language },
        audioConfig: { audioEncoding: "MP3" },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate audio content: ${response.statusText}`);
  }

  const data = (await response.json()) as PostTextToSpeechResponse;

  // // Cloudflare Workers での Base64 デコード
  // const audioContent = Uint8Array.from(atob(data.audioContent), (c) =>
  //   c.charCodeAt(0)
  // );

  if (!data.audioContent) {
    throw new Error("Failed to generate audio content");
  }

  return data;
};
