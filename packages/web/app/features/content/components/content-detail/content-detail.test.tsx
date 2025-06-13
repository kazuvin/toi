import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText("入力ソースを表示")).toBeInTheDocument();
    expect(screen.getByText("フラッシュカード")).toBeInTheDocument();
    expect(screen.getByText("学習コンテンツ")).toBeInTheDocument();
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

  it("データがない場合は学習コンテンツは生成中状態で表示される", () => {
    mockUseContentDetail.mockReturnValue({
      data: undefined,
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    // データがない場合でも学習コンテンツセクションは表示され、生成中状態になる
    expect(screen.getByText("フラッシュカード")).toBeInTheDocument();
    expect(screen.getByText("学習コンテンツ")).toBeInTheDocument();
    expect(screen.getByText("生成中...")).toBeInTheDocument();
  });

  it("入力ソースを表示ボタンが存在する", () => {
    mockUseContentDetail.mockReturnValue({
      data: mockData,
      mutate: vi.fn(),
      error: null,
      isLoading: false,
    });

    renderContentDetail();

    const showSourceButton = screen.getByRole("button", { name: "入力ソースを表示" });
    expect(showSourceButton).toBeInTheDocument();
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
    expect(screen.getByText("生成中...")).toBeInTheDocument();
    
    // カード全体が半透明になっている
    const flashcardCard = screen.getByText("フラッシュカード").closest('div');
    expect(flashcardCard).toHaveClass("opacity-50", "pointer-events-none");
  });
});
