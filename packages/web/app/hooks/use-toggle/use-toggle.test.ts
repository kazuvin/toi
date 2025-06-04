import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./use-toggle";
import { describe, expect, it } from "vitest";

describe("useToggle", () => {
  it("should initialize with default value false", () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.value).toBe(false);
  });

  it("should initialize with provided initial value", () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current.value).toBe(true);
  });

  it("should toggle value when toggle function is called", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(false);
  });

  it("should set value to true when setTrue is called", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.setTrue();
    });

    expect(result.current.value).toBe(true);
  });

  it("should set value to false when setFalse is called", () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current.setFalse();
    });

    expect(result.current.value).toBe(false);
  });

  it("should set specific value when setValue is called", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.setValue(true);
    });

    expect(result.current.value).toBe(true);

    act(() => {
      result.current.setValue(false);
    });

    expect(result.current.value).toBe(false);
  });
});
