import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useContentDetail } from "./use-content-detail";

// Mock modules
vi.mock("swr", () => ({
  default: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock("~/services/sources", () => ({
  getSourceById: vi.fn(),
}));

vi.mock("~/services/source", () => ({
  postTitle: vi.fn(),
}));

vi.mock("~/services/flashcard", () => ({
  postFlashcard: vi.fn(),
}));

const mockUseSWR = vi.mocked(await import("swr")).default;
const mockGetSourceById = vi.mocked(
  await import("~/services/sources")
).getSourceById;

describe("useContentDetail", () => {
  const mockData = {
    id: "1",
    title: "Test Title",
    content: "Test Content",
    type: "TEXT" as const,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    isFlashcardGenerated: true,
  };

  const mockMutateLocal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSWR.mockReturnValue({
      data: mockData,
      mutate: mockMutateLocal,
      error: null,
      isLoading: false,
      isValidating: false,
    });
  });

  it("idが提供された場合、正しいキーでSWRを呼び出す", () => {
    renderHook(() => useContentDetail("1"));

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/sources/1",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("idがundefinedの場合、nullキーでSWRを呼び出す", () => {
    renderHook(() => useContentDetail(undefined));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("正しいデータ構造を返す", () => {
    const { result } = renderHook(() => useContentDetail("1"));

    expect(result.current).toEqual({
      data: mockData,
      mutate: mockMutateLocal,
      error: null,
      isLoading: false,
    });
  });

  it("SWRのfetcher関数が正しくgetSourceByIdを呼び出す", async () => {
    mockGetSourceById.mockResolvedValue(mockData);

    renderHook(() => useContentDetail("1"));

    // Get the fetcher function from the SWR call
    const fetcherFunction = mockUseSWR.mock.calls[0]?.[1];
    if (fetcherFunction) {
      const result = await fetcherFunction();
      expect(mockGetSourceById).toHaveBeenCalledWith("1");
      expect(result).toBe(mockData);
    }
  });
});
