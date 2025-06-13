/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ContentList } from "./content-list";
import { GetSourcesResponse } from "@toi/shared/src/schemas/source";

const mockContents: GetSourcesResponse = [
  {
    id: "1",
    uid: "user1",
    title: "テストタイトル1",
    content: "テストコンテンツ1の内容です。これはテスト用のコンテンツです。",
    type: "TEXT",
    isFlashcardGenerated: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    uid: "user1",
    title: "テストタイトル2",
    content: "テストコンテンツ2の内容です。",
    type: "TEXT",
    isFlashcardGenerated: false,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    uid: "user1",
    content: "タイトルなしのコンテンツです。",
    type: "TEXT",
    isFlashcardGenerated: false,
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ContentList", () => {
  it("コンテンツが正しく表示される", () => {
    renderWithRouter(<ContentList contents={mockContents} />);

    expect(screen.getByText("テストタイトル1")).toBeInTheDocument();
    expect(screen.getByText("テストタイトル2")).toBeInTheDocument();
    expect(screen.getByText("無題")).toBeInTheDocument();
    
    expect(screen.getByText("テストコンテンツ1の内容です。これはテスト用のコンテンツです。")).toBeInTheDocument();
    expect(screen.getByText("テストコンテンツ2の内容です。")).toBeInTheDocument();
    expect(screen.getByText("タイトルなしのコンテンツです。")).toBeInTheDocument();
  });

  it("フラッシュカード生成済みの表示が正しい", () => {
    renderWithRouter(<ContentList contents={mockContents} />);

    expect(screen.getByText("フラッシュカード生成済み")).toBeInTheDocument();
    expect(screen.getByText("学習")).toBeInTheDocument();
  });

  it("詳細リンクが正しく表示される", () => {
    renderWithRouter(<ContentList contents={mockContents} />);

    const detailLinks = screen.getAllByText("詳細");
    expect(detailLinks).toHaveLength(3);
    
    expect(detailLinks[0].closest("a")).toHaveAttribute("href", "/content/1");
    expect(detailLinks[1].closest("a")).toHaveAttribute("href", "/content/2");
    expect(detailLinks[2].closest("a")).toHaveAttribute("href", "/content/3");
  });

  it("学習リンクはフラッシュカード生成済みのコンテンツにのみ表示される", () => {
    renderWithRouter(<ContentList contents={mockContents} />);

    const learningLinks = screen.getAllByText("学習");
    expect(learningLinks).toHaveLength(1);
    expect(learningLinks[0].closest("a")).toHaveAttribute("href", "/content/1/flashcards");
  });

  it("ローディング状態が正しく表示される", () => {
    renderWithRouter(<ContentList contents={[]} isLoading={true} />);

    const skeletonCards = document.querySelectorAll(".animate-pulse");
    expect(skeletonCards).toHaveLength(6);
  });

  it("コンテンツが空の場合、空状態が表示される", () => {
    renderWithRouter(<ContentList contents={[]} />);

    expect(screen.getByText("まだコンテンツがありません")).toBeInTheDocument();
    expect(screen.getByText("新しいコンテンツを作る")).toBeInTheDocument();
    expect(screen.getByText("新しいコンテンツを作る").closest("a")).toHaveAttribute("href", "/content/new");
  });

  it("コンテンツタイプが表示される", () => {
    renderWithRouter(<ContentList contents={mockContents} />);

    const typeLabels = screen.getAllByText("TEXT");
    expect(typeLabels).toHaveLength(3);
  });
});