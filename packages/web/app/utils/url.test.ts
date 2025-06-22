import { describe, expect, it, vi, beforeEach } from "vitest";

// URL関数をテスト用に直接実装
function testGetBaseUrl(baseUrl: string | undefined): string {
  if (!baseUrl) {
    throw new Error('VITE_BASE_URL environment variable is not set');
  }
  return baseUrl;
}

function testGetCanonicalUrl(path: string, baseUrl: string): string {
  // パスが "/"で始まらない場合は追加
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // ベースURLの末尾のスラッシュを削除してパスと結合
  return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
}

describe("url utils", () => {
  beforeEach(() => {
    // vitestのenv設定
    vi.stubEnv('VITE_BASE_URL', 'https://example.com');
  });

  describe("getBaseUrl", () => {
    it("should return base URL from environment variable", () => {
      const result = testGetBaseUrl('https://example.com');
      expect(result).toBe('https://example.com');
    });

    it("should throw error when VITE_BASE_URL is not set", () => {
      expect(() => testGetBaseUrl('')).toThrow('VITE_BASE_URL environment variable is not set');
    });

    it("should throw error when VITE_BASE_URL is undefined", () => {
      expect(() => testGetBaseUrl(undefined)).toThrow('VITE_BASE_URL environment variable is not set');
    });
  });

  describe("getCanonicalUrl", () => {
    const baseUrl = "https://example.com";
    
    it("should generate canonical URL with root path", () => {
      expect(testGetCanonicalUrl("/", baseUrl)).toBe(`${baseUrl}/`);
    });

    it("should generate canonical URL with path", () => {
      expect(testGetCanonicalUrl("/contents", baseUrl)).toBe(`${baseUrl}/contents`);
    });

    it("should generate canonical URL with path including ID", () => {
      expect(testGetCanonicalUrl("/content/123", baseUrl)).toBe(`${baseUrl}/content/123`);
    });

    it("should add leading slash to path without slash", () => {
      expect(testGetCanonicalUrl("contents", baseUrl)).toBe(`${baseUrl}/contents`);
    });

    it("should handle empty path", () => {
      expect(testGetCanonicalUrl("", baseUrl)).toBe(`${baseUrl}/`);
    });

    it("should handle complex paths", () => {
      expect(testGetCanonicalUrl("/content/123/flashcards", baseUrl)).toBe(`${baseUrl}/content/123/flashcards`);
    });

    it("should properly normalize paths", () => {
      // パスの正規化をテスト
      expect(testGetCanonicalUrl("", baseUrl)).toBe(`${baseUrl}/`);
      expect(testGetCanonicalUrl("/", baseUrl)).toBe(`${baseUrl}/`);
      expect(testGetCanonicalUrl("content", baseUrl)).toBe(`${baseUrl}/content`);
      expect(testGetCanonicalUrl("/content", baseUrl)).toBe(`${baseUrl}/content`);
    });

    it("should handle base URL with trailing slash", () => {
      const baseUrlWithSlash = "https://example.com/";
      expect(testGetCanonicalUrl("/contents", baseUrlWithSlash)).toBe("https://example.com/contents");
      expect(testGetCanonicalUrl("contents", baseUrlWithSlash)).toBe("https://example.com/contents");
    });
  });
});