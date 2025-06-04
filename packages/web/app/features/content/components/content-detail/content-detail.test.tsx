import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContentDetail } from "./content-detail";

// Mock the custom hook
vi.mock("../../hooks/use-content-detail", () => ({
  useContentDetail: vi.fn(),
}));

// Mock the react-router-dom useParams
vi.mock("@remix-run/react", async () => {
  const actual = await vi.importActual("@remix-run/react");
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

const mockUseContentDetail = vi.mocked(
  await import("../../hooks/use-content-detail")
).useContentDetail;
const mockUseParams = vi.mocked(await import("@remix-run/react")).useParams;

function renderContentDetail() {
  return render(
    <BrowserRouter>
      <ContentDetail />
    </BrowserRouter>
  );
}

describe("ContentDetail", () => {
  const mockData = {
    id: "1",
    title: "Test Title",
    content:
      "This is a test content that should be displayed in the component. It might be very long and should be collapsible.",
    type: "TEXT" as const,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    isFlashcardGenerated: true,
  };

  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "1" });
  });

  it("正常にレンダリングされる", () => {
    mockUseContentDetail.mockReturnValue({
      data: mockData,
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("入力")).toBeInTheDocument();
    expect(screen.getByText("フラッシュカード")).toBeInTheDocument();
    expect(screen.getByText("選択問題")).toBeInTheDocument();
  });

  it("タイトルがない場合は生成中表示される", () => {
    mockUseContentDetail.mockReturnValue({
      data: { ...mockData, title: undefined },
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    expect(screen.getByText("生成中...")).toBeInTheDocument();
  });

  it("データがない場合はタイトル部分のみ表示される", () => {
    mockUseContentDetail.mockReturnValue({
      data: undefined,
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    // タイトル部分はあるが、具体的なタイトルテキストはない
    expect(screen.queryByText("生成中...")).not.toBeInTheDocument();
  });

  it("コンテンツの展開・折りたたみが動作する", () => {
    mockUseContentDetail.mockReturnValue({
      data: mockData,
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    const expandButton = screen.getByRole("button");

    // 初期状態では折りたたまれている
    const contentElement = screen.getByText(mockData.content);
    expect(contentElement).toHaveClass("line-clamp-3");

    // ボタンをクリックして展開
    fireEvent.click(expandButton);
    expect(contentElement).not.toHaveClass("line-clamp-3");

    // 再度クリックして折りたたみ
    fireEvent.click(expandButton);
    expect(contentElement).toHaveClass("line-clamp-3");
  });

  it("フラッシュカードが生成中の場合、生成中状態が表示される", () => {
    mockUseContentDetail.mockReturnValue({
      data: { ...mockData, isFlashcardGenerated: false },
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    // フラッシュカードのContentCardが生成中状態になっている
    const flashcardLinks = screen.getAllByRole("link");
    const flashcardLink = flashcardLinks.find((link) =>
      link.getAttribute("href")?.includes("flashcards")
    );

    expect(flashcardLink).toHaveAttribute("aria-disabled", "true");
  });
});
