import { renderHook, act } from "@testing-library/react";
import { useFileHandler } from "./use-file-handler";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

// Mock FileReader
const mockFileReader = {
  readAsText: vi.fn(),
  onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
  result: null as string | null,
};

Object.defineProperty(global, "FileReader", {
  value: vi.fn(() => mockFileReader),
});

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    readText: vi.fn(),
  },
});

describe("useFileHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFileReader.result = null;
    mockFileReader.onload = null;
  });

  it("should initialize with empty input text", () => {
    const { result } = renderHook(() => useFileHandler());

    expect(result.current.inputText).toBe("");
  });

  it("should update input text when setInputText is called", () => {
    const { result } = renderHook(() => useFileHandler());

    act(() => {
      result.current.setInputText("新しいテキスト");
    });

    expect(result.current.inputText).toBe("新しいテキスト");
  });

  it("should clear input text when clearInput is called", () => {
    const { result } = renderHook(() => useFileHandler());

    act(() => {
      result.current.setInputText("テスト");
    });

    expect(result.current.inputText).toBe("テスト");

    act(() => {
      result.current.clearInput();
    });

    expect(result.current.inputText).toBe("");
  });

  it("should handle file upload", () => {
    const { result } = renderHook(() => useFileHandler());
    const file = new File(["ファイルの内容"], "test.txt", {
      type: "text/plain",
    });
    const event = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileUpload(event);
    });

    expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);

    // Simulate file read completion
    mockFileReader.result = "ファイルの内容";
    if (mockFileReader.onload) {
      act(() => {
        mockFileReader.onload!({
          target: { result: "ファイルの内容" },
        } as ProgressEvent<FileReader>);
      });
    }

    expect(result.current.inputText).toBe("ファイルの内容");
  });

  it("should handle clipboard paste", async () => {
    const mockClipboard = navigator.clipboard.readText as unknown as Mock;
    mockClipboard.mockResolvedValueOnce("クリップボードの内容");

    const { result } = renderHook(() => useFileHandler());

    await act(async () => {
      await result.current.handlePasteFromClipboard();
    });

    expect(mockClipboard).toHaveBeenCalled();
    expect(result.current.inputText).toBe("クリップボードの内容");
  });

  it("should handle clipboard error gracefully", async () => {
    const mockClipboard = navigator.clipboard.readText as unknown as Mock;
    mockClipboard.mockRejectedValueOnce(new Error("クリップボードエラー"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useFileHandler());

    await act(async () => {
      await result.current.handlePasteFromClipboard();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "クリップボードからの読み取りに失敗しました:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
