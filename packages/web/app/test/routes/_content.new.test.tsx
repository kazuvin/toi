import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ContentNew from "../../routes/_content.new";
import * as contentHooks from "~/features/content/hooks";

// モックの設定
vi.mock("~/features/content/hooks", () => ({
  useFileHandler: vi.fn(),
  useContentCreation: vi.fn(),
  usePdfHandler: vi.fn(),
  useYoutubeHandler: vi.fn(),
  useContentForm: vi.fn(),
}));

vi.mock("~/features/content/components", () => ({
  InputMethodSelector: ({ selectedMethod, onMethodChange }: { selectedMethod: string; onMethodChange: (method: string) => void }) => (
    <div data-testid="input-method-selector">
      <button onClick={() => onMethodChange("text")}>Text</button>
      <button onClick={() => onMethodChange("pdf")}>PDF</button>
      <span>Selected: {selectedMethod}</span>
    </div>
  ),
  InputArea: ({ inputMethod, inputText, onInputTextChange, onPdfUpload }: { inputMethod: string; inputText: string; onInputTextChange: (text: string) => void; onPdfUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div data-testid="input-area">
      <textarea 
        value={inputText}
        onChange={(e) => onInputTextChange(e.target.value)}
        data-testid="input-text"
      />
      {inputMethod === "pdf" && (
        <input 
          type="file" 
          onChange={onPdfUpload}
          data-testid="pdf-upload"
        />
      )}
    </div>
  ),
  ContentCreationHeader: () => <div data-testid="header">Header</div>,
  PlanIndicator: () => <div data-testid="plan">Plan</div>,
  ContentCreationButton: ({ disabled, isLoading, onClick }: { disabled: boolean; isLoading: boolean; onClick: () => void }) => (
    <button 
      disabled={disabled}
      onClick={onClick}
      data-testid="create-button"
    >
      {isLoading ? "Loading..." : "Create"}
    </button>
  ),
}));

describe("ContentNew", () => {
  const mockUseFileHandler = vi.mocked(contentHooks.useFileHandler);
  const mockUseContentCreation = vi.mocked(contentHooks.useContentCreation);
  const mockUsePdfHandler = vi.mocked(contentHooks.usePdfHandler);
  const mockUseYoutubeHandler = vi.mocked(contentHooks.useYoutubeHandler);
  const mockUseContentForm = vi.mocked(contentHooks.useContentForm);

  const defaultMocks = {
    useFileHandler: {
      inputText: "",
      setInputText: vi.fn(),
      handleFileUpload: vi.fn(),
      handlePasteFromClipboard: vi.fn(),
      clearInput: vi.fn(),
    },
    useContentCreation: {
      isLoading: false,
      createContent: vi.fn(),
    },
    usePdfHandler: {
      pdfData: null,
      handlePdfUpload: vi.fn(),
      clearPdfData: vi.fn(),
    },
    useYoutubeHandler: {
      youtubeData: null,
      handleYoutubeUrlChange: vi.fn(),
      clearYoutubeData: vi.fn(),
    },
    useContentForm: {
      inputMethod: "text" as const,
      inputText: "",
      handleInputMethodChange: vi.fn(),
      handleInputTextChange: vi.fn(),
      updateInputTextFromPdf: vi.fn(),
      isFormValid: vi.fn().mockReturnValue(false),
      resetForm: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFileHandler.mockReturnValue(defaultMocks.useFileHandler);
    mockUseContentCreation.mockReturnValue(defaultMocks.useContentCreation);
    mockUsePdfHandler.mockReturnValue(defaultMocks.usePdfHandler);
    mockUseYoutubeHandler.mockReturnValue(defaultMocks.useYoutubeHandler);
    mockUseContentForm.mockReturnValue(defaultMocks.useContentForm);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ContentNew />
      </BrowserRouter>
    );
  };

  it("コンポーネントが正常にレンダリングされること", () => {
    renderComponent();
    
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("plan")).toBeInTheDocument();
    expect(screen.getByTestId("input-method-selector")).toBeInTheDocument();
    expect(screen.getByTestId("input-area")).toBeInTheDocument();
    expect(screen.getByTestId("create-button")).toBeInTheDocument();
  });

  it("入力方法変更時にhandleInputMethodChangeが呼ばれること", () => {
    renderComponent();
    
    const pdfButton = screen.getByText("PDF");
    fireEvent.click(pdfButton);
    
    expect(defaultMocks.useContentForm.handleInputMethodChange).toHaveBeenCalledWith("pdf");
  });

  it("テキスト入力時にhandleInputTextChangeが呼ばれること", () => {
    renderComponent();
    
    const textarea = screen.getByTestId("input-text");
    fireEvent.change(textarea, { target: { value: "test input" } });
    
    expect(defaultMocks.useContentForm.handleInputTextChange).toHaveBeenCalledWith("test input");
  });

  it("PDFアップロード時に適切な処理が実行されること", () => {
    const mockHandlePdfUpload = vi.fn().mockReturnValue({
      fileName: "test.pdf",
      fileSize: "10.5",
    });

    mockUseContentForm.mockReturnValue({
      ...defaultMocks.useContentForm,
      inputMethod: "pdf",
    });

    mockUsePdfHandler.mockReturnValue({
      ...defaultMocks.usePdfHandler,
      handlePdfUpload: mockHandlePdfUpload,
    });

    renderComponent();
    
    const fileInput = screen.getByTestId("pdf-upload");
    const mockFile = new File(["test"], "test.pdf", { type: "application/pdf" });
    
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    expect(mockHandlePdfUpload).toHaveBeenCalled();
    expect(defaultMocks.useContentForm.updateInputTextFromPdf).toHaveBeenCalledWith("test.pdf", "10.5");
  });

  it("フォームが無効な場合は作成ボタンが無効になること", () => {
    mockUseContentForm.mockReturnValue({
      ...defaultMocks.useContentForm,
      isFormValid: vi.fn().mockReturnValue(false),
    });

    renderComponent();
    
    const createButton = screen.getByTestId("create-button");
    expect(createButton).toBeDisabled();
  });

  it("フォームが有効な場合は作成ボタンが有効になること", () => {
    mockUseContentForm.mockReturnValue({
      ...defaultMocks.useContentForm,
      isFormValid: vi.fn().mockReturnValue(true),
    });

    renderComponent();
    
    const createButton = screen.getByTestId("create-button");
    expect(createButton).not.toBeDisabled();
  });

  it("ローディング中は作成ボタンが無効になること", () => {
    mockUseContentCreation.mockReturnValue({
      ...defaultMocks.useContentCreation,
      isLoading: true,
    });

    renderComponent();
    
    const createButton = screen.getByTestId("create-button");
    expect(createButton).toBeDisabled();
    expect(createButton).toHaveTextContent("Loading...");
  });

  it("テキスト入力方法でコンテンツ作成が実行されること", async () => {
    mockUseContentForm.mockReturnValue({
      ...defaultMocks.useContentForm,
      inputMethod: "text",
      inputText: "test content",
      isFormValid: vi.fn().mockReturnValue(true),
    });

    renderComponent();
    
    const createButton = screen.getByTestId("create-button");
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(defaultMocks.useContentCreation.createContent).toHaveBeenCalledWith(
        "test content",
        ["flashcard"],
        "text"
      );
    });
  });

  it("PDF入力方法でコンテンツ作成が実行されること", async () => {
    const mockPdfData = {
      fileName: "test.pdf",
      fileContent: "base64content",
    };

    mockUseContentForm.mockReturnValue({
      ...defaultMocks.useContentForm,
      inputMethod: "pdf",
      inputText: "PDFファイル: test.pdf (10.5 KB)",
      isFormValid: vi.fn().mockReturnValue(true),
    });

    mockUsePdfHandler.mockReturnValue({
      ...defaultMocks.usePdfHandler,
      pdfData: mockPdfData,
    });

    renderComponent();
    
    const createButton = screen.getByTestId("create-button");
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(defaultMocks.useContentCreation.createContent).toHaveBeenCalledWith(
        "PDFファイル: test.pdf (10.5 KB)",
        ["flashcard"],
        "pdf",
        mockPdfData
      );
    });
  });

  it("フォームが無効な場合はコンテンツ作成が実行されないこと", async () => {
    mockUseContentForm.mockReturnValue({
      ...defaultMocks.useContentForm,
      isFormValid: vi.fn().mockReturnValue(false),
    });

    renderComponent();
    
    const createButton = screen.getByTestId("create-button");
    fireEvent.click(createButton);
    
    expect(defaultMocks.useContentCreation.createContent).not.toHaveBeenCalled();
  });
});