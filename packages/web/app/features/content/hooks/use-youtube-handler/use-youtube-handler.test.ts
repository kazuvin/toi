import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useYoutubeHandler } from "./use-youtube-handler";

describe("useYoutubeHandler", () => {
  it("有効なYouTube URLを設定できる", () => {
    const { result } = renderHook(() => useYoutubeHandler());

    act(() => {
      result.current.handleYoutubeUrlChange("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    });

    expect(result.current.youtubeData).toEqual({
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  it("youtu.be形式のURLも有効とする", () => {
    const { result } = renderHook(() => useYoutubeHandler());

    act(() => {
      result.current.handleYoutubeUrlChange("https://youtu.be/dQw4w9WgXcQ");
    });

    expect(result.current.youtubeData).toEqual({
      url: "https://youtu.be/dQw4w9WgXcQ",
    });
  });

  it("無効なURLの場合はnullになる", () => {
    const { result } = renderHook(() => useYoutubeHandler());

    act(() => {
      result.current.handleYoutubeUrlChange("https://example.com");
    });

    expect(result.current.youtubeData).toBeNull();
  });

  it("空文字の場合はnullになる", () => {
    const { result } = renderHook(() => useYoutubeHandler());

    act(() => {
      result.current.handleYoutubeUrlChange("");
    });

    expect(result.current.youtubeData).toBeNull();
  });

  it("clearYoutubeDataでデータをクリアできる", () => {
    const { result } = renderHook(() => useYoutubeHandler());

    act(() => {
      result.current.handleYoutubeUrlChange("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    });

    expect(result.current.youtubeData).not.toBeNull();

    act(() => {
      result.current.clearYoutubeData();
    });

    expect(result.current.youtubeData).toBeNull();
  });
});