import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContentForm } from "./use-content-form";
import type { PdfData } from "../use-pdf-handler";

describe("useContentForm", () => {
  it("初期状態が正しく設定されること", () => {
    const { result } = renderHook(() => useContentForm());
    
    expect(result.current.inputMethod).toBe("text");
    expect(result.current.inputText).toBe("");
  });

  it("入力方法の変更が正常に動作すること", () => {
    const { result } = renderHook(() => useContentForm());
    
    act(() => {
      result.current.handleInputMethodChange("pdf");
    });

    expect(result.current.inputMethod).toBe("pdf");
    expect(result.current.inputText).toBe("");
  });

  it("入力方法変更時にテキストがクリアされること", () => {
    const { result } = renderHook(() => useContentForm());
    
    act(() => {
      result.current.handleInputTextChange("test text");
    });

    expect(result.current.inputText).toBe("test text");

    act(() => {
      result.current.handleInputMethodChange("website");
    });

    expect(result.current.inputMethod).toBe("website");
    expect(result.current.inputText).toBe("");
  });

  it("入力テキストの変更が正常に動作すること", () => {
    const { result } = renderHook(() => useContentForm());
    
    act(() => {
      result.current.handleInputTextChange("新しいテキスト");
    });

    expect(result.current.inputText).toBe("新しいテキスト");
  });

  it("PDFからの入力テキスト更新が正常に動作すること", () => {
    const { result } = renderHook(() => useContentForm());
    
    act(() => {
      result.current.updateInputTextFromPdf("test.pdf", "10.5");
    });

    expect(result.current.inputText).toBe("PDFファイル: test.pdf (10.5 KB)");
  });

  describe("isFormValid", () => {
    it("テキストが空の場合はfalseを返すこと", () => {
      const { result } = renderHook(() => useContentForm());
      
      expect(result.current.isFormValid()).toBe(false);
    });

    it("テキスト入力方法でテキストがある場合はtrueを返すこと", () => {
      const { result } = renderHook(() => useContentForm());
      
      act(() => {
        result.current.handleInputTextChange("テストテキスト");
      });

      expect(result.current.isFormValid()).toBe(true);
    });

    it("PDF入力方法でPDFデータがない場合はfalseを返すこと", () => {
      const { result } = renderHook(() => useContentForm());
      
      act(() => {
        result.current.handleInputMethodChange("pdf");
        result.current.handleInputTextChange("PDFファイル: test.pdf (10.5 KB)");
      });

      expect(result.current.isFormValid()).toBe(false);
    });

    it("PDF入力方法でPDFデータがある場合はtrueを返すこと", () => {
      const { result } = renderHook(() => useContentForm());
      
      const pdfData: PdfData = {
        fileName: "test.pdf",
        fileContent: "base64content",
      };

      act(() => {
        result.current.handleInputMethodChange("pdf");
        result.current.handleInputTextChange("PDFファイル: test.pdf (10.5 KB)");
      });

      expect(result.current.isFormValid(pdfData)).toBe(true);
    });

    it("website入力方法でテキストがある場合はtrueを返すこと", () => {
      const { result } = renderHook(() => useContentForm());
      
      act(() => {
        result.current.handleInputMethodChange("website");
        result.current.handleInputTextChange("https://example.com");
      });

      expect(result.current.isFormValid()).toBe(true);
    });
  });

  it("フォームリセットが正常に動作すること", () => {
    const { result } = renderHook(() => useContentForm());
    
    act(() => {
      result.current.handleInputMethodChange("pdf");
      result.current.handleInputTextChange("テストテキスト");
    });

    expect(result.current.inputMethod).toBe("pdf");
    expect(result.current.inputText).toBe("テストテキスト");

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.inputMethod).toBe("text");
    expect(result.current.inputText).toBe("");
  });
});