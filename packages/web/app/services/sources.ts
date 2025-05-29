import {
  GetSourceDetailResponse,
  GetSourcesResponse,
} from "@toi/shared/src/schemas/source";
import { api } from "./base";

export const getSources = async () => {
  return api.get<GetSourcesResponse>("/sources");
};

export const getSourceById = async (id: string) => {
  return api.get<GetSourceDetailResponse>(`/sources/${id}`);
};
