import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContentAddCard } from "./content-add-card";

describe("ContentAddCard", () => {
  const mockProps = {
    title: "コンテンツを追加",
    onClick: vi.fn(),
  };

  it("正常にレンダリングされる", () => {
    render(<ContentAddCard {...mockProps} />);

    expect(screen.getByText("コンテンツを追加")).toBeInTheDocument();
  });

  it("Plusアイコンが表示される", () => {
    render(<ContentAddCard {...mockProps} />);

    const plusIcon = screen.getByRole("generic", { hidden: true });
    expect(plusIcon).toBeInTheDocument();
  });

  it("hover効果のクラスが適用されている", () => {
    const { container } = render(<ContentAddCard {...mockProps} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("hover:border-ring/50");
    expect(card).toHaveClass("transition-colors");
  });

  it("正しいレイアウトクラスが適用されている", () => {
    const { container } = render(<ContentAddCard {...mockProps} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("h-64");
    expect(card).toHaveClass("border-dashed");
    expect(card).toHaveClass("cursor-pointer");
  });
});
