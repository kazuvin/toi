import { describe, expect, it } from "vitest";
import { getBaseUrl, getCanonicalUrl } from "./url";

describe("url utils", () => {
  // getBaseUrl は環境変数に依存するため、実際の環境変数をテスト
  describe("getBaseUrl", () => {
    it("should return base URL from environment variable", () => {
      // 実際のテスト環境のVITE_BASE_URLを使用（通常は http://localhost:5173）
      const result = getBaseUrl();
      expect(result).toMatch(/^https?:\/\/.+/); // URLの形式であることを確認
    });
  });

  describe("getCanonicalUrl", () => {
    // 実際の環境のベースURLを使用してテスト
    const baseUrl = "http://localhost:5173"; // テスト環境のデフォルト
    
    it("should generate canonical URL with root path", () => {
      expect(getCanonicalUrl("/")).toBe(`${baseUrl}/`);
    });

    it("should generate canonical URL with path", () => {
      expect(getCanonicalUrl("/contents")).toBe(`${baseUrl}/contents`);
    });

    it("should generate canonical URL with path including ID", () => {
      expect(getCanonicalUrl("/content/123")).toBe(`${baseUrl}/content/123`);
    });

    it("should add leading slash to path without slash", () => {
      expect(getCanonicalUrl("contents")).toBe(`${baseUrl}/contents`);
    });

    it("should handle empty path", () => {
      expect(getCanonicalUrl("")).toBe(`${baseUrl}/`);
    });

    it("should handle complex paths", () => {
      expect(getCanonicalUrl("/content/123/flashcards")).toBe(`${baseUrl}/content/123/flashcards`);
    });

    it("should properly normalize paths", () => {
      // パスの正規化をテスト
      expect(getCanonicalUrl("")).toBe(`${baseUrl}/`);
      expect(getCanonicalUrl("/")).toBe(`${baseUrl}/`);
      expect(getCanonicalUrl("content")).toBe(`${baseUrl}/content`);
      expect(getCanonicalUrl("/content")).toBe(`${baseUrl}/content`);
    });
  });
});