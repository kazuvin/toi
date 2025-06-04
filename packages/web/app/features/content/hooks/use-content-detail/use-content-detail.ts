import useSWR, { mutate as globalMutate } from "swr";
import { getSourceById } from "~/services/sources";
import { postTitle } from "~/services/source";
import { postFlashcard } from "~/services/flashcard";

export function useContentDetail(id: string | undefined) {
  const { data, mutate, error, isLoading } = useSWR(
    id ? `/api/sources/${id}` : null,
    async () => {
      const response = await getSourceById(id!);
      return response;
    },
    {
      revalidateOnFocus: false,
      onSuccess: async (data) => {
        if (!data.title) {
          await postTitle({ sourceId: id! });
          mutate();
          globalMutate("/api/sources");
        }

        if (!data.isFlashcardGenerated) {
          await postFlashcard({ sourceId: id! });
          mutate();
        }
      },
    }
  );

  return {
    data,
    mutate,
    error,
    isLoading,
  };
}
