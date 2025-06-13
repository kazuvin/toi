import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { ContentCard, type ContentCardProps } from "./content-card";
import { BookOpen } from "lucide-react";

function renderContentCard(props: Partial<ContentCardProps> = {}) {
  const defaultProps: ContentCardProps = {
    title: "Test Title",
    description: "Test Description",
    icon: <BookOpen data-testid="icon" />,
    to: "/test",
    ...props,
  };

  return render(
    <BrowserRouter>
      <ContentCard {...defaultProps} />
    </BrowserRouter>
  );
}

describe("ContentCard", () => {
  it("正常にレンダリングされる", () => {
    renderContentCard();

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "はじめる" })).toBeInTheDocument();
  });

  it("生成中の状態を正しく表示する", () => {
    renderContentCard({ isGenerating: true });

    expect(screen.getByText("生成中...")).toBeInTheDocument();
    // 生成中の時はリンクとしてレンダリングされるがdisabledになる
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("disabled", "");
  });

  it("正しいリンク先が設定される", () => {
    renderContentCard({ to: "/custom-path" });

    expect(screen.getByRole("link")).toHaveAttribute("href", "/custom-path");
  });

  it("アイコンが正しく表示される", () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    renderContentCard({ icon: customIcon });

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
