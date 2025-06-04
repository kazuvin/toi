import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { FlashcardItem } from "../flashcard-item";
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
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleReset() {
    setCurrentIndex(0);
    setCompletedCards({});
  }

  const isCompleted = currentIndex >= flashcards.length;
  const currentCard = flashcards[currentIndex];
  const completedCount = Object.keys(completedCards).length;
  const okCount = Object.values(completedCards).filter(
    (v) => v === "ok"
  ).length;
  const ngCount = Object.values(completedCards).filter(
    (v) => v === "ng"
  ).length;

  if (isCompleted) {
    return (
      <div className={cn("flex flex-col items-center space-y-6", className)}>
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
        <Button onClick={handleReset} size="lg">
          もう一度学習する
        </Button>
      </div>
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
          <span>{Math.round((currentIndex / flashcards.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(currentIndex / flashcards.length) * 100}%`,
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
              className="absolute w-80 h-48 bg-gray-300 rounded-xl shadow-lg"
              style={{
                transform: `translateY(${(index + 1) * 4}px) scale(${
                  1 - (index + 1) * 0.02
                })`,
                zIndex: -index - 1,
              }}
            />
          ))}

        {/* Current card */}
        {currentCard && (
          <FlashcardItem
            flashcard={currentCard}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-4">
        <Button
          variant="destructive"
          size="lg"
          onClick={handleSwipeLeft}
          className="px-8"
        >
          NG
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={handleSwipeRight}
          className="px-8 bg-green-600 hover:bg-green-700"
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
