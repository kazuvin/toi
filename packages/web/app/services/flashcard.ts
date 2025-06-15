import {
  PostFlashcardRequestBody,
  PostFlashcardResponse,
  GetSourceFlashcardsResponse,
  PutFlashcardRequestBody,
  PutFlashcardResponse,
} from "@toi/shared/src/schemas/source";
import { api } from "./base";

export const postFlashcard = async (body: PostFlashcardRequestBody) => {
  return api.post<PostFlashcardResponse>("/sources/flashcard", body);
};

export const getFlashcardsBySourceId = async (sourceId: string) => {
  return api.get<GetSourceFlashcardsResponse>(
    `/sources/${sourceId}/flashcards`
  );
};

export const updateFlashcard = async (
  sourceId: string,
  flashcardId: string,
  body: PutFlashcardRequestBody
) => {
  return api.put<PutFlashcardResponse>(
    `/sources/${sourceId}/flashcards/${flashcardId}`,
    body
  );
};
