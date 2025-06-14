import {
  GetSourceDetailResponse,
  GetSourcesResponse,
  PutSourceBody,
  PutSourceDetailResponse,
  PostSourceBody,
  PostSourceDetailResponse,
  PostSourceFromUrlBody,
  PostSourceFromPdfBody,
} from "@toi/shared/src/schemas/source";
import { api } from "./base";

export const getSources = async () => {
  return api.get<GetSourcesResponse>("/sources");
};

export const getSourceById = async (id: string) => {
  return api.get<GetSourceDetailResponse>(`/sources/${id}`);
};

export const updateSource = async (id: string, body: PutSourceBody) => {
  return api.put<PutSourceDetailResponse>(`/sources/${id}`, body);
};

export const createSource = async (body: PostSourceBody) => {
  return api.post<PostSourceDetailResponse>("/sources", body);
};

export const createSourceFromUrl = async (body: PostSourceFromUrlBody) => {
  return api.post<PostSourceDetailResponse>("/sources/url", body);
};

export const createSourceFromPdf = async (body: PostSourceFromPdfBody) => {
  return api.post<PostSourceDetailResponse>("/sources/pdf", body);
};
