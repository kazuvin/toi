import {
  GetSourceFlashcardsResponse,
  PostTitleRequestBody,
  PostTitleResponse,
} from "@toi/shared/src/schemas/source";
import { api } from "./base";

export const getSourceFlashcards = async (id: string) => {
  return api.get<GetSourceFlashcardsResponse>(`/sources/${id}/flashcards`);
};

export const postTitle = async (body: PostTitleRequestBody) => {
  return api.post<PostTitleResponse>("/sources/title", body);
};
