import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { OutputFormatCard } from "./output-format-card";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("OutputFormatCard", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("should render title and description", () => {
    render(
      <OutputFormatCard
        title="テストタイトル"
        description="テスト説明"
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
    expect(screen.getByText("テスト説明")).toBeInTheDocument();
  });

  it("should apply selected styles when isSelected is true", () => {
    render(
      <OutputFormatCard
        title="テストタイトル"
        description="テスト説明"
        isSelected={true}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-violet-200", "bg-gradient-to-br", "from-violet-50", "to-purple-50");
  });

  it("should apply unselected styles when isSelected is false", () => {
    render(
      <OutputFormatCard
        title="テストタイトル"
        description="テスト説明"
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-gray-200", "bg-white/80", "backdrop-blur-sm");
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();

    render(
      <OutputFormatCard
        title="テストタイトル"
        description="テスト説明"
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when Enter key is pressed", async () => {
    const user = userEvent.setup();

    render(
      <OutputFormatCard
        title="テストタイトル"
        description="テスト説明"
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    // Enterキーはブラウザのデフォルトでbuttonをクリックするため、onClick + onKeyDownで2回呼ばれる
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it("should call onClick when Space key is pressed", async () => {
    const user = userEvent.setup();

    render(
      <OutputFormatCard
        title="テストタイトル"
        description="テスト説明"
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard(" ");

    // Spaceキーはブラウザのデフォルトでbuttonをクリックするため、onClick + onKeyDownで2回呼ばれる
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });
});
