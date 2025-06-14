import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePdfHandler } from "./use-pdf-handler";

const mockFileReader = {
  readAsDataURL: vi.fn(),
  result: null as string | null,
  onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
  onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
};

Object.defineProperty(global, "FileReader", {
  writable: true,
  value: vi.fn(() => mockFileReader),
});

describe("usePdfHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFileReader.result = null;
    mockFileReader.onload = null;
    mockFileReader.onerror = null;
  });

  it("初期状態でpdfDataがnullであること", () => {
    const { result } = renderHook(() => usePdfHandler());
    
    expect(result.current.pdfData).toBeNull();
  });

  it("PDFファイルのアップロードが正常に動作すること", async () => {
    const { result } = renderHook(() => usePdfHandler());
    
    const mockFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
      lastModified: Date.now(),
    });
    Object.defineProperty(mockFile, "size", { value: 1024 });
    
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const base64Content = "dGVzdA==";
    mockFileReader.result = `data:application/pdf;base64,${base64Content}`;

    let fileInfo: { fileName: string; fileSize: string } | null = null;
    act(() => {
      fileInfo = result.current.handlePdfUpload(mockEvent);
    });

    expect(fileInfo).toEqual({
      fileName: "test.pdf",
      fileSize: "1.0",
    });

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

    act(() => {
      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: mockFileReader.result } } as ProgressEvent<FileReader>);
      }
    });

    expect(result.current.pdfData).toEqual({
      fileName: "test.pdf",
      fileContent: base64Content,
    });
  });

  it("ファイルが選択されていない場合はnullを返すこと", () => {
    const { result } = renderHook(() => usePdfHandler());
    
    const mockEvent = {
      target: {
        files: null,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    let fileInfo: { fileName: string; fileSize: string } | null = null;
    act(() => {
      fileInfo = result.current.handlePdfUpload(mockEvent);
    });

    expect(fileInfo).toBeNull();
    expect(result.current.pdfData).toBeNull();
  });

  it("ファイル読み込みエラー時にpdfDataがnullになること", () => {
    const { result } = renderHook(() => usePdfHandler());
    
    const mockFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });
    
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handlePdfUpload(mockEvent);
    });

    act(() => {
      if (mockFileReader.onerror) {
        mockFileReader.onerror({} as ProgressEvent<FileReader>);
      }
    });

    expect(result.current.pdfData).toBeNull();
  });

  it("clearPdfDataが正常に動作すること", () => {
    const { result } = renderHook(() => usePdfHandler());
    
    const mockFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });
    
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    mockFileReader.result = "data:application/pdf;base64,dGVzdA==";

    act(() => {
      result.current.handlePdfUpload(mockEvent);
    });

    act(() => {
      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: mockFileReader.result } } as ProgressEvent<FileReader>);
      }
    });

    expect(result.current.pdfData).not.toBeNull();

    act(() => {
      result.current.clearPdfData();
    });

    expect(result.current.pdfData).toBeNull();
  });
});