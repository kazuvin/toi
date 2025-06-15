import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFlashcardDeck } from "./use-flashcard-deck";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

const mockFlashcards: GetSourceFlashcardsResponse["flashcards"] = [
  { 
    id: "1", 
    question: "Question 1", 
    answer: "Answer 1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    sourceId: "source-1"
  },
  { 
    id: "2", 
    question: "Question 2", 
    answer: "Answer 2",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    sourceId: "source-1"
  },
  { 
    id: "3", 
    question: "Question 3", 
    answer: "Answer 3",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    sourceId: "source-1"
  },
];

describe("useFlashcardDeck", () => {
  describe("Normal mode (no thorough learning)", () => {
    it("should initialize with first card", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: false,
        })
      );

      expect(result.current.currentCard).toEqual(mockFlashcards[0]);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.totalOkCards).toBe(0);
    });

    it("should remove card from deck on OK", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: false,
        })
      );

      const initialDeckLength = result.current.currentDeck.length;

      act(() => {
        result.current.handleOk();
      });

      expect(result.current.currentDeck.length).toBe(initialDeckLength - 1);
      expect(result.current.currentCard).toEqual(mockFlashcards[1]);
      expect(result.current.cardStats["1"]).toEqual({ okCount: 1, ngCount: 0 });
      expect(result.current.progressPercentage).toBe(0); // No OK cards in normal mode
    });

    it("should move card to end on NG", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: false,
        })
      );

      const initialCard = result.current.currentCard;
      const initialDeckLength = result.current.currentDeck.length;

      act(() => {
        result.current.handleNg();
      });

      expect(result.current.currentDeck.length).toBe(initialDeckLength);
      expect(result.current.currentCard).toEqual(mockFlashcards[1]);
      expect(result.current.currentDeck[result.current.currentDeck.length - 1]).toEqual(initialCard);
      expect(result.current.cardStats["1"]).toEqual({ okCount: 0, ngCount: 1 });
    });

    it("should complete when deck is empty", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: false,
        })
      );

      // Remove all cards
      act(() => {
        result.current.handleOk(); // Card 1
      });
      act(() => {
        result.current.handleOk(); // Card 2
      });
      act(() => {
        result.current.handleOk(); // Card 3
      });

      expect(result.current.isCompleted).toBe(true);
      expect(result.current.currentDeck.length).toBe(0);
    });
  });

  describe("Thorough learning mode", () => {
    it("should remove card completely on OK", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: true,
        })
      );

      const initialDeckLength = result.current.currentDeck.length;

      act(() => {
        result.current.handleOk();
      });

      expect(result.current.currentDeck.length).toBe(initialDeckLength - 1);
      expect(result.current.totalOkCards).toBe(1);
      expect(result.current.progressPercentage).toBe(33); // 1/3 cards OK
      expect(result.current.cardStats["1"]).toEqual({ okCount: 1, ngCount: 0 });
    });

    it("should move card to end of deck on NG", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: true,
        })
      );

      const initialCard = result.current.currentCard;
      const initialDeckLength = result.current.currentDeck.length;

      act(() => {
        result.current.handleNg();
      });

      expect(result.current.currentDeck.length).toBe(initialDeckLength);
      expect(result.current.currentCard).toEqual(mockFlashcards[1]);
      expect(result.current.currentDeck[result.current.currentDeck.length - 1]).toEqual(initialCard);
      expect(result.current.totalOkCards).toBe(0); // No cards removed
      expect(result.current.progressPercentage).toBe(0);
      expect(result.current.cardStats["1"]).toEqual({ okCount: 0, ngCount: 1 });
    });

    it("should complete when all cards are OK'd", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: true,
        })
      );

      // OK all cards
      act(() => {
        result.current.handleOk(); // Remove card 1
      });
      act(() => {
        result.current.handleOk(); // Remove card 2
      });
      act(() => {
        result.current.handleOk(); // Remove card 3
      });

      expect(result.current.isCompleted).toBe(true);
      expect(result.current.totalOkCards).toBe(3);
      expect(result.current.progressPercentage).toBe(100);
    });

    it.skip("should continue with NG cards until all are OK", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: true,
        })
      );

      // NG first card (moves to end)
      act(() => {
        result.current.handleNg();
      });

      expect(result.current.currentCard?.id).toBe("2");
      expect(result.current.cardStats["1"]).toEqual({ okCount: 0, ngCount: 1 });

      // OK second card (removes it)
      act(() => {
        result.current.handleOk();
      });

      expect(result.current.totalOkCards).toBe(1);
      expect(result.current.currentCard?.id).toBe("3");

      // OK third card (removes it)
      act(() => {
        result.current.handleOk();
      });

      expect(result.current.totalOkCards).toBe(2);
      expect(result.current.currentCard?.id).toBe("1"); // Only NG'd card remains

      // OK the remaining card
      act(() => {
        result.current.handleOk();
      });

      expect(result.current.isCompleted).toBe(true);
      expect(result.current.totalOkCards).toBe(3);
    });
  });

  describe("Card statistics", () => {
    it.skip("should track OK and NG counts per card", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: true,
        })
      );

      // NG first card multiple times
      act(() => {
        result.current.handleNg();
      });
      act(() => {
        result.current.handleNg(); // Card 2
      });
      act(() => {
        result.current.handleNg(); // Card 3  
      });

      // Now we're back to card 1, NG it again
      expect(result.current.currentCard?.id).toBe("1");
      act(() => {
        result.current.handleNg();
      });

      expect(result.current.cardStats["1"]).toEqual({ okCount: 0, ngCount: 2 });
      expect(result.current.cardStats["2"]).toEqual({ okCount: 0, ngCount: 1 });
      expect(result.current.cardStats["3"]).toEqual({ okCount: 0, ngCount: 1 });

      // Now OK the first card
      act(() => {
        result.current.handleOk();
      });

      expect(result.current.cardStats["2"]).toEqual({ okCount: 0, ngCount: 1 });
      expect(result.current.cardStats["1"]).toEqual({ okCount: 1, ngCount: 2 });
    });
  });

  describe("Reset functionality", () => {
    it("should reset all state", () => {
      const { result } = renderHook(() =>
        useFlashcardDeck({
          flashcards: mockFlashcards,
          shuffle: false,
          thoroughLearning: false,
        })
      );

      // Make some progress
      act(() => {
        result.current.handleOk();
      });
      act(() => {
        result.current.handleNg();
      });

      expect(Object.keys(result.current.cardStats).length).toBeGreaterThan(0);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentCard).toEqual(mockFlashcards[0]);
      expect(result.current.cardStats).toEqual({});
      expect(result.current.totalOkCards).toBe(0);
      expect(result.current.progressPercentage).toBe(0);
    });
  });

  describe("Shuffle functionality", () => {
    it("should handle shuffle setting", () => {
      const { result, rerender } = renderHook(
        ({ shuffle }) =>
          useFlashcardDeck({
            flashcards: mockFlashcards,
            shuffle,
            thoroughLearning: false,
          }),
        { initialProps: { shuffle: false } }
      );

      const originalOrder = result.current.currentDeck.map(card => card.id);

      // Enable shuffle
      rerender({ shuffle: true });

      const shuffledOrder = result.current.currentDeck.map(card => card.id);

      // Should contain same cards
      expect(shuffledOrder).toHaveLength(originalOrder.length);
      expect(shuffledOrder).toEqual(expect.arrayContaining(originalOrder));
    });
  });
});