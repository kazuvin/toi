import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { FlashcardItem } from "../flashcard-item";
import { Confetti } from "../confetti";
import { shuffleAtom, thoroughLearningAtom } from "~/state";
import { useFlashcardDeck } from "../../hooks";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

type Props = {
  flashcards: GetSourceFlashcardsResponse["flashcards"];
  className?: string;
};

export function FlashcardDeck({ flashcards, className }: Props) {
  const [shuffle] = useAtom(shuffleAtom);
  const [thoroughLearning] = useAtom(thoroughLearningAtom);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const {
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
  } = useFlashcardDeck({
    flashcards,
    shuffle,
    thoroughLearning
  });

  // Handle swipe left (NG)
  function handleSwipeLeft() {
    if (!currentCard || isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      handleNg();
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  }

  // Handle swipe right (OK)
  function handleSwipeRight() {
    if (!currentCard || isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      handleOk();
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  }

  // Handle reset with animation
  function handleReset() {
    setIsAnimating(true);
    setShowCelebration(false);
    setTimeout(() => {
      reset();
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  }

  // Show celebration when completed
  useEffect(() => {
    if (isCompleted) {
      setShowCelebration(true);
    }
  }, [isCompleted]);


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
                {totalOkCards} / {totalOriginalCards} 完了
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
          </div>

          {/* カード毎のNG回数一覧 */}
          <div className="w-full max-w-2xl space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">学習結果</h3>
            <div className="space-y-2">
              {flashcards.map((card) => {
                const ngCount = cardStats[card.id]?.ngCount || 0;
                const displayMessage = ngCount === 0 ? "完璧!" : `${ngCount}回間違い`;
                const badgeColor = ngCount === 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
                
                return (
                  <div
                    key={card.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600 mb-1">Q:</div>
                        <div className="text-gray-800 font-medium mb-2 line-clamp-2">
                          {card.question}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">A:</div>
                        <div className="text-gray-700 text-sm line-clamp-2">
                          {card.answer}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          badgeColor
                        )}>
                          {displayMessage}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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

  // Create a unique key for the current card to force re-render
  const cardKey = currentCard 
    ? `${currentCard.id}-${cardStats[currentCard.id]?.okCount || 0}-${cardStats[currentCard.id]?.ngCount || 0}-${currentDeck.length}`
    : 'no-card';

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Progress - Show OK cards out of total */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            {totalOkCards} / {totalOriginalCards} 完了
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
        {currentDeck.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 text-center">
            残り {currentDeck.length} 枚
          </div>
        )}
      </div>

      {/* Card Stack */}
      <div className="relative">
        {/* Background cards for stack effect */}
        {currentDeck
          .slice(1, 3)
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
              key={cardKey} // Force re-render when card stats change
              flashcard={currentCard}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </div>
        )}
      </div>

      {/* Card Stats */}
      {currentCard && (cardStats[currentCard.id]?.okCount > 0 || cardStats[currentCard.id]?.ngCount > 0) && (
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-green-600">OK:</span>
            <span className="font-medium">{cardStats[currentCard.id]?.okCount || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-red-600">NG:</span>
            <span className="font-medium">{cardStats[currentCard.id]?.ngCount || 0}</span>
          </div>
        </div>
      )}

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
        {thoroughLearning && (
          <p className="mt-2 text-blue-600 font-medium">
            徹底学習モード: NGカードは再度出題されます
          </p>
        )}
      </div>
    </div>
  );
}