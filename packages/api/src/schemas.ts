import { z } from "zod";

export const PaginationQuerySchema = z.object({
  page: z.string(),
  limit: z.string(),
});
