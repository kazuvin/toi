import { describe, expect, it, vi, beforeEach } from "vitest";
import { callAnthropic } from "./anthropic";

// fetchをモック
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("anthropic utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("callAnthropic", () => {
    it("should successfully call Anthropic API and return text", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [{ text: "Hello, world!" }]
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await callAnthropic("test prompt", "test-api-key");

      expect(result).toBe("Hello, world!");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "test-api-key",
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-latest",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: "test prompt"
              }
            ]
          })
        }
      );
    });

    it("should throw error when API response is not ok", async () => {
      const mockResponse = {
        ok: false,
        statusText: "Bad Request"
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(callAnthropic("test prompt", "test-api-key"))
        .rejects
        .toThrow("Failed to get response from Claude: Bad Request");
    });

    it("should handle fetch network error", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(callAnthropic("test prompt", "test-api-key"))
        .rejects
        .toThrow("Network error");
    });

    it("should handle malformed JSON response", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON"))
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(callAnthropic("test prompt", "test-api-key"))
        .rejects
        .toThrow("Invalid JSON");
    });

    it("should call API with correct parameters for different inputs", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [{ text: "Response text" }]
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await callAnthropic("different prompt", "different-api-key");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/messages",
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-api-key": "different-api-key"
          }),
          body: expect.stringContaining("different prompt")
        })
      );
    });

    it("should handle empty response content", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: []
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(callAnthropic("test prompt", "test-api-key"))
        .rejects
        .toThrow();
    });

    it("should handle response with multiple content items", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [
            { text: "First response" },
            { text: "Second response" }
          ]
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await callAnthropic("test prompt", "test-api-key");

      expect(result).toBe("First response");
    });
  });
});