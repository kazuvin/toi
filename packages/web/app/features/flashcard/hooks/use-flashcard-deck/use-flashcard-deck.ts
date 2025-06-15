import { useState, useEffect, useCallback } from "react";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

type CardStats = {
  okCount: number;
  ngCount: number;
};

type UseFlashcardDeckOptions = {
  flashcards: GetSourceFlashcardsResponse["flashcards"];
  shuffle: boolean;
  thoroughLearning: boolean;
};

type UseFlashcardDeckReturn = {
  currentDeck: GetSourceFlashcardsResponse["flashcards"];
  currentCard: GetSourceFlashcardsResponse["flashcards"][0] | undefined;
  isCompleted: boolean;
  cardStats: Record<string, CardStats>;
  totalOriginalCards: number;
  totalOkCards: number;
  progressPercentage: number;
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
  const [cardStats, setCardStats] = useState<Record<string, CardStats>>({});
  const [removedCardIds, setRemovedCardIds] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  
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

  // Initialize or update deck
  useEffect(() => {
    let deck: GetSourceFlashcardsResponse["flashcards"];
    
    if (thoroughLearning) {
      // In thorough learning mode, only include cards that haven't been removed (OK'd)
      deck = flashcards.filter(card => !removedCardIds.has(card.id));
    } else {
      // In normal mode, include all cards
      deck = [...flashcards];
    }

    // Apply shuffle if enabled and this is initial setup or shuffle setting changed
    if (shuffle && (!isInitialized || !isInitialized)) {
      deck = shuffleDeck(deck);
    }

    setCurrentDeck(deck);
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [flashcards, thoroughLearning, removedCardIds, shuffle, shuffleDeck, isInitialized]);

  // Reset when flashcards change (different content)
  useEffect(() => {
    setCardStats({});
    setRemovedCardIds(new Set());
    setIsInitialized(false);
  }, [flashcards]);

  // Handle OK - remove card from deck (in thorough learning) or move to next
  const handleOk = useCallback(() => {
    const currentCard = currentDeck[0]; // Always use index 0
    if (!currentCard) return;

    // Update card stats
    setCardStats(prev => ({
      ...prev,
      [currentCard.id]: {
        okCount: (prev[currentCard.id]?.okCount || 0) + 1,
        ngCount: prev[currentCard.id]?.ngCount || 0
      }
    }));

    if (thoroughLearning) {
      // In thorough learning mode, remove card from deck
      setRemovedCardIds(prev => new Set([...prev, currentCard.id]));
    } else {
      // In normal mode, remove card from current deck
      setCurrentDeck(prev => prev.slice(1));
    }
  }, [currentDeck, thoroughLearning]);

  // Handle NG - behavior depends on learning mode
  const handleNg = useCallback(() => {
    const currentCard = currentDeck[0]; // Always use index 0
    if (!currentCard) return;

    // Update card stats
    setCardStats(prev => ({
      ...prev,
      [currentCard.id]: {
        okCount: prev[currentCard.id]?.okCount || 0,
        ngCount: (prev[currentCard.id]?.ngCount || 0) + 1
      }
    }));

    if (thoroughLearning) {
      // In thorough learning mode, move card to end of deck
      setCurrentDeck(prev => {
        const newDeck = [...prev];
        const [movedCard] = newDeck.splice(0, 1);
        newDeck.push(movedCard);
        return newDeck;
      });
    } else {
      // In normal mode, remove card from deck (same as OK)
      setCurrentDeck(prev => prev.slice(1));
    }
  }, [currentDeck, thoroughLearning]);

  // Reset function
  const reset = useCallback(() => {
    setCardStats({});
    setRemovedCardIds(new Set());
    setIsInitialized(false);
  }, []);

  // Calculate completion status
  const isCompleted = thoroughLearning 
    ? removedCardIds.size === totalOriginalCards  // All cards removed (all OK)
    : currentDeck.length === 0;                   // No cards left in deck

  // Calculate current card (always index 0)
  const currentCard = currentDeck[0];

  // Calculate total OK cards and progress
  const totalOkCards = thoroughLearning 
    ? removedCardIds.size  // In thorough learning, count removed cards
    : totalOriginalCards - currentDeck.length;  // In normal mode, count processed cards

  // Calculate progress - based on processed cards out of total
  const progressPercentage = Math.round((totalOkCards / totalOriginalCards) * 100);

  return {
    currentDeck,
    currentCard,
    isCompleted,
    cardStats,
    totalOriginalCards,
    totalOkCards,
    progressPercentage,
    handleOk,
    handleNg,
    reset
  };
}