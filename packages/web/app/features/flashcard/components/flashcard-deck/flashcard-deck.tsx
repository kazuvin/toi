import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { FlashcardItem } from "../flashcard-item";
import { Confetti } from "../confetti";
import { shuffleAtom, thoroughLearningAtom } from "~/state";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

type Props = {
  flashcards: GetSourceFlashcardsResponse["flashcards"];
  className?: string;
};

export function FlashcardDeck({ flashcards, className }: Props) {
  const [shuffle] = useAtom(shuffleAtom);
  const [thoroughLearning] = useAtom(thoroughLearningAtom);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<{
    [key: string]: "ok" | "ng";
  }>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ngCards, setNgCards] = useState<string[]>([]);
  const [currentDeck, setCurrentDeck] = useState<GetSourceFlashcardsResponse["flashcards"]>([]);

  // Create deck based on settings and current state
  const createDeck = useCallback(() => {
    let deck = [...flashcards];
    
    // If we have NG cards to review in thorough learning mode
    if (thoroughLearning && ngCards.length > 0) {
      deck = flashcards.filter(card => ngCards.includes(card.id));
    }
    
    return deck;
  }, [flashcards, thoroughLearning, ngCards]);

  // Shuffle deck function (called only when shuffle setting changes)
  const shuffleDeck = useCallback((deck: GetSourceFlashcardsResponse["flashcards"]) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Update current deck when dependencies change
  useEffect(() => {
    const newDeck = createDeck();
    const finalDeck = shuffle ? shuffleDeck(newDeck) : newDeck;
    setCurrentDeck(finalDeck);
  }, [createDeck, shuffle, shuffleDeck]);

  // flashcardsが変更された時（異なるフラッシュカードに遷移した時）にstateを初期化
  useEffect(() => {
    setCurrentIndex(0);
    setCompletedCards({});
    setIsAnimating(false);
    setShowCelebration(false);
    setNgCards([]);
    const newDeck = createDeck();
    const finalDeck = shuffle ? shuffleDeck(newDeck) : newDeck;
    setCurrentDeck(finalDeck);
  }, [flashcards, createDeck, shuffle, shuffleDeck]);

  function handleSwipeLeft() {
    const currentCard = currentDeck[currentIndex];
    if (currentCard) {
      setCompletedCards((prev) => ({
        ...prev,
        [currentCard.id]: "ng",
      }));
      
      // Thorough learning: add NG cards to review queue
      if (thoroughLearning && !ngCards.includes(currentCard.id)) {
        setNgCards((prev) => [...prev, currentCard.id]);
      }
      
      nextCard();
    }
  }

  function handleSwipeRight() {
    const currentCard = currentDeck[currentIndex];
    if (currentCard) {
      setCompletedCards((prev) => ({
        ...prev,
        [currentCard.id]: "ok",
      }));
      
      // If this was an NG card that user got right, remove from NG queue
      if (thoroughLearning && ngCards.includes(currentCard.id)) {
        setNgCards((prev) => prev.filter(id => id !== currentCard.id));
      }
      
      nextCard();
    }
  }

  function nextCard() {
    setIsAnimating(true);

    // Check if this is the last card in current deck
    const isLastCard = currentIndex >= currentDeck.length - 1;

    setTimeout(() => {
      if (isLastCard) {
        // If thorough learning is enabled and there are NG cards to review
        if (thoroughLearning && ngCards.length > 0) {
          // Reset to start reviewing NG cards
          setCurrentIndex(0);
          // Deck will be updated automatically by createDeck memo
        } else {
          // Complete the learning session
          setCurrentIndex(currentDeck.length);
          setShowCelebration(true);
        }
      } else {
        // Move to next card
        setCurrentIndex(currentIndex + 1);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  }

  function handleReset() {
    setIsAnimating(true);
    setShowCelebration(false);
    setTimeout(() => {
      setCurrentIndex(0);
      setCompletedCards({});
      setNgCards([]);
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  }

  // カードが変わったときの初期アニメーション
  useEffect(() => {
    if (currentIndex < currentDeck.length) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentDeck.length]);

  const isCompleted = currentIndex >= currentDeck.length && (!thoroughLearning || ngCards.length === 0);
  const currentCard = currentDeck[currentIndex];
  const completedCount = Object.keys(completedCards).length;
  const okCount = Object.values(completedCards).filter(
    (v) => v === "ok"
  ).length;
  const ngCountValue = Object.values(completedCards).filter(
    (v) => v === "ng"
  ).length;

  // 進捗率の計算（完了時は100%）
  const progressPercentage = isCompleted
    ? 100
    : Math.round((completedCount / flashcards.length) * 100);

  if (isCompleted) {
    return (
      <>
        {/* 紙吹雪エフェクト */}
        <Confetti active={showCelebration} />
        
        <div className={cn("flex flex-col items-center space-y-6", className)}>
          {/* 100%完了の進捗表示 */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              {flashcards.length} / {flashcards.length}
            </span>
            <span className="text-green-600 font-bold">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* 完了メッセージ */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">学習完了!</h2>
          <div className="space-y-2">
            <p className="text-lg text-gray-600">
              {flashcards.length}枚中{completedCount}枚完了
            </p>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {okCount}
                </div>
                <div className="text-sm text-gray-500">正解</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{ngCountValue}</div>
                <div className="text-sm text-gray-500">不正解</div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleReset}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          もう一度学習する
        </Button>
        </div>
      </>
    );
  }

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Progress */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            {currentIndex + 1} / {currentDeck.length}
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative">
        {/* Background cards for stack effect */}
        {currentDeck
          .slice(currentIndex + 1, currentIndex + 3)
          .map((_, index) => (
            <div
              key={index}
              className={cn(
                "absolute w-96 h-64 bg-gray-300 rounded-xl shadow-lg transition-all duration-300",
                isAnimating && "scale-95 opacity-50"
              )}
              style={{
                transform: `translateY(${(index + 1) * 4}px) scale(${
                  1 - (index + 1) * 0.02
                })`,
                zIndex: -index - 1,
              }}
            />
          ))}

        {/* Current card with animation */}
        {currentCard && (
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              isAnimating
                ? "scale-90 opacity-0 transform rotate-1"
                : "scale-100 opacity-100 transform rotate-0"
            )}
          >
            <FlashcardItem
              key={`${currentCard.id}-${currentIndex}`} // カードが変わったときにコンポーネントを再マウント
              flashcard={currentCard}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-4">
        <Button
          variant="destructive"
          size="lg"
          onClick={handleSwipeLeft}
          className="px-8"
          disabled={isAnimating}
        >
          NG
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={handleSwipeRight}
          className="px-8 bg-green-600 hover:bg-green-700"
          disabled={isAnimating}
        >
          OK
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p>カードをクリックして表裏をめくることができます</p>
        <p>左右にドラッグするか、ボタンを押してOK/NGを選択してください</p>
      </div>
    </div>
  );
}
