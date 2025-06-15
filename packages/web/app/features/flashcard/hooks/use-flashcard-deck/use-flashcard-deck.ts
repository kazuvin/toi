import { useState, useEffect, useCallback } from "react";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

type FlashcardResult = "ok" | "ng";

type UseFlashcardDeckOptions = {
  flashcards: GetSourceFlashcardsResponse["flashcards"];
  shuffle: boolean;
  thoroughLearning: boolean;
};

type UseFlashcardDeckReturn = {
  currentDeck: GetSourceFlashcardsResponse["flashcards"];
  currentIndex: number;
  currentCard: GetSourceFlashcardsResponse["flashcards"][0] | undefined;
  isCompleted: boolean;
  completedCards: Record<string, FlashcardResult>;
  removedCards: Set<string>;
  totalOriginalCards: number;
  progressPercentage: number;
  okCount: number;
  ngCount: number;
  handleOk: () => void;
  handleNg: () => void;
  reset: () => void;
};

export function useFlashcardDeck({
  flashcards,
  shuffle,
  thoroughLearning
}: UseFlashcardDeckOptions): UseFlashcardDeckReturn {
  const [currentDeck, setCurrentDeck] = useState<GetSourceFlashcardsResponse["flashcards"]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<Record<string, FlashcardResult>>({});
  const [removedCards, setRemovedCards] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const totalOriginalCards = flashcards.length;

  // Shuffle deck function
  const shuffleDeck = useCallback((deck: GetSourceFlashcardsResponse["flashcards"]) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Create deck based on current state
  const createDeck = useCallback(() => {
    // In thorough learning mode, only include cards that are not removed
    const availableCards = thoroughLearning 
      ? flashcards.filter(card => !removedCards.has(card.id))
      : flashcards;
    
    return [...availableCards];
  }, [flashcards, thoroughLearning, removedCards]);

  // Initialize deck when flashcards change or shuffle/thoroughLearning settings change
  useEffect(() => {
    const newDeck = createDeck();
    const prevDeckLength = currentDeck.length;
    
    // Apply shuffle if enabled and not already shuffled
    if (shuffle && !isShuffled) {
      setCurrentDeck(shuffleDeck(newDeck));
      setIsShuffled(true);
    } else if (!shuffle && isShuffled) {
      // Turn off shuffle, recreate in original order
      setCurrentDeck(newDeck);
      setIsShuffled(false);
    } else {
      // Normal update
      setCurrentDeck(newDeck);
    }

    // In thorough learning mode, adjust currentIndex if deck shrank due to removed cards
    if (thoroughLearning && newDeck.length < prevDeckLength && currentIndex >= newDeck.length) {
      setCurrentIndex(Math.max(0, newDeck.length - 1));
    }
  }, [createDeck, shuffle, isShuffled, shuffleDeck, thoroughLearning, currentIndex, currentDeck.length]);

  // Reset when flashcards array changes (different content)
  useEffect(() => {
    setCurrentIndex(0);
    setCompletedCards({});
    setRemovedCards(new Set());
    setIsShuffled(false);
  }, [flashcards]);

  // Handle OK - remove card from deck
  const handleOk = useCallback(() => {
    const currentCard = currentDeck[currentIndex];
    if (!currentCard) return;

    // Mark as completed
    setCompletedCards(prev => ({
      ...prev,
      [currentCard.id]: "ok"
    }));

    if (thoroughLearning) {
      // In thorough learning mode, remove card from available cards
      setRemovedCards(prev => new Set([...prev, currentCard.id]));
      
      // Stay at current index as deck will be updated
      // If this was the last card, completion will be handled by the deck update
    } else {
      // In normal mode, just move to next card
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentDeck, currentIndex, thoroughLearning]);

  // Handle NG - move card to end of deck (thoroughLearning) or just move to next
  const handleNg = useCallback(() => {
    const currentCard = currentDeck[currentIndex];
    if (!currentCard) return;

    // Mark as completed with NG
    setCompletedCards(prev => ({
      ...prev,
      [currentCard.id]: "ng"
    }));

    if (thoroughLearning) {
      // In thorough learning mode, move card to end of deck
      setCurrentDeck(prev => {
        const newDeck = [...prev];
        const [removedCard] = newDeck.splice(currentIndex, 1);
        newDeck.push(removedCard);
        return newDeck;
      });
      
      // Don't increment index as card was removed from current position
    } else {
      // In normal mode, just move to next card
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentDeck, currentIndex, thoroughLearning]);

  // Reset function
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setCompletedCards({});
    setRemovedCards(new Set());
  }, []);

  // Calculate completion status
  const isCompleted = thoroughLearning 
    ? removedCards.size === totalOriginalCards  // All cards removed (all OK)
    : currentIndex >= currentDeck.length;       // Reached end of deck

  // Calculate current card
  const currentCard = currentDeck[currentIndex];

  // Calculate progress - in thorough learning mode, based on removed cards
  const progressPercentage = thoroughLearning
    ? Math.round((removedCards.size / totalOriginalCards) * 100)
    : Math.round((Object.keys(completedCards).length / totalOriginalCards) * 100);

  // Calculate counts
  const okCount = Object.values(completedCards).filter(result => result === "ok").length;
  const ngCount = Object.values(completedCards).filter(result => result === "ng").length;

  return {
    currentDeck,
    currentIndex,
    currentCard,
    isCompleted,
    completedCards,
    removedCards,
    totalOriginalCards,
    progressPercentage,
    okCount,
    ngCount,
    handleOk,
    handleNg,
    reset
  };
}