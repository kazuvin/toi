import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContentAddCard } from "./content-add-card";

describe("ContentAddCard", () => {
  it("正常にレンダリングされる", () => {
    render(<ContentAddCard />);

    expect(screen.getByText("コンテンツを追加")).toBeInTheDocument();
  });

  it("Plusアイコンが表示される", () => {
    render(<ContentAddCard />);

    const plusIcon = screen.getByRole("generic", { hidden: true });
    expect(plusIcon).toBeInTheDocument();
  });

  it("hover効果のクラスが適用されている", () => {
    const { container } = render(<ContentAddCard />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("hover:border-ring/50");
    expect(card).toHaveClass("transition-colors");
  });

  it("正しいレイアウトクラスが適用されている", () => {
    const { container } = render(<ContentAddCard />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("h-64");
    expect(card).toHaveClass("border-dashed");
    expect(card).toHaveClass("cursor-pointer");
  });
});
