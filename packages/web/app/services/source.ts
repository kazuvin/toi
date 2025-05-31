import { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";
import { api } from "./base";

export const getSourceFlashcards = async (id: string) => {
  return api.get<GetSourceFlashcardsResponse>(`/sources/${id}/flashcards`);
};
