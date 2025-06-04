import { renderHook, act } from "@testing-library/react";
import { useOutputFormats } from "./use-output-formats";
import { describe, expect, it } from "vitest";

describe("useOutputFormats", () => {
  it("should initialize with all formats set to false", () => {
    const { result } = renderHook(() => useOutputFormats());

    expect(result.current.outputFormats).toEqual({
      flashcard: false,
      multipleChoice: false,
      fillInTheBlank: false,
      essay: false,
    });
    expect(result.current.hasSelectedFormats).toBe(false);
    expect(result.current.getSelectedFormats()).toEqual([]);
  });

  it("should toggle a single format", () => {
    const { result } = renderHook(() => useOutputFormats());

    act(() => {
      result.current.toggleOutputFormat("flashcard");
    });

    expect(result.current.outputFormats.flashcard).toBe(true);
    expect(result.current.hasSelectedFormats).toBe(true);
    expect(result.current.getSelectedFormats()).toEqual(["flashcard"]);
  });

  it("should toggle multiple formats", () => {
    const { result } = renderHook(() => useOutputFormats());

    act(() => {
      result.current.toggleOutputFormat("flashcard");
      result.current.toggleOutputFormat("multipleChoice");
    });

    expect(result.current.outputFormats.flashcard).toBe(true);
    expect(result.current.outputFormats.multipleChoice).toBe(true);
    expect(result.current.hasSelectedFormats).toBe(true);
    expect(result.current.getSelectedFormats()).toEqual([
      "flashcard",
      "multipleChoice",
    ]);
  });

  it("should toggle format off when called twice", () => {
    const { result } = renderHook(() => useOutputFormats());

    act(() => {
      result.current.toggleOutputFormat("flashcard");
    });

    expect(result.current.outputFormats.flashcard).toBe(true);

    act(() => {
      result.current.toggleOutputFormat("flashcard");
    });

    expect(result.current.outputFormats.flashcard).toBe(false);
    expect(result.current.hasSelectedFormats).toBe(false);
    expect(result.current.getSelectedFormats()).toEqual([]);
  });

  it("should return correct selected formats", () => {
    const { result } = renderHook(() => useOutputFormats());

    act(() => {
      result.current.toggleOutputFormat("essay");
      result.current.toggleOutputFormat("fillInTheBlank");
    });

    const selectedFormats = result.current.getSelectedFormats();
    expect(selectedFormats).toContain("essay");
    expect(selectedFormats).toContain("fillInTheBlank");
    expect(selectedFormats).toHaveLength(2);
  });
});
