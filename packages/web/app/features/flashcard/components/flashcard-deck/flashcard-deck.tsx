import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { FlashcardItem } from "../flashcard-item";
import { Confetti } from "../confetti";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

type Props = {
  flashcards: GetSourceFlashcardsResponse["flashcards"];
  className?: string;
};

export function FlashcardDeck({ flashcards, className }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<{
    [key: string]: "ok" | "ng";
  }>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  function handleSwipeLeft() {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      setCompletedCards((prev) => ({
        ...prev,
        [currentCard.id]: "ng",
      }));
      nextCard();
    }
  }

  function handleSwipeRight() {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      setCompletedCards((prev) => ({
        ...prev,
        [currentCard.id]: "ok",
      }));
      nextCard();
    }
  }

  function nextCard() {
    setIsAnimating(true);

    // 最後のカードかどうかをチェック
    const isLastCard = currentIndex >= flashcards.length - 1;

    // アニメーション開始
    setTimeout(() => {
      if (isLastCard) {
        // 最後のカードの場合は完了状態に移行
        setCurrentIndex(flashcards.length);
        setShowCelebration(true);
      } else {
        // 次のカードに移動
        setCurrentIndex(currentIndex + 1);
      }

      // アニメーション終了
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
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  }

  // カードが変わったときの初期アニメーション
  useEffect(() => {
    if (currentIndex < flashcards.length) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, flashcards.length]);

  const isCompleted = currentIndex >= flashcards.length;
  const currentCard = flashcards[currentIndex];
  const completedCount = Object.keys(completedCards).length;
  const okCount = Object.values(completedCards).filter(
    (v) => v === "ok"
  ).length;
  const ngCount = Object.values(completedCards).filter(
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
                <div className="text-2xl font-bold text-red-600">{ngCount}</div>
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
            {currentIndex + 1} / {flashcards.length}
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
        {flashcards
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
