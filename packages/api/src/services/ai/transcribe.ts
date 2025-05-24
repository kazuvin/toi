import OpenAI from "openai";

/**
 * Transcribes audio to text using OpenAI's Whisper API.
 * @param apiKey - The API key for OpenAI.
 * @param audioBase64 - The base64 encoded audio data to transcribe.
 * @param language - The language of the audio.
 * @returns The transcribed text.
 */
export async function transcribeAudio(
  apiKey: string,
  audioBase64: string,
  language: string = "en"
): Promise<string> {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Convert base64 to Blob
    const binaryString = atob(audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: "audio/x-m4a" });

    // Convert Blob to File
    const audioFile = new File([audioBlob], "audio.m4a", {
      type: "audio/x-m4a",
    });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return response.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  }
}
