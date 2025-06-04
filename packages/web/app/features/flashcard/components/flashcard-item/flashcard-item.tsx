import { useState } from "react";
import { cn } from "~/lib/utils";
import type { GetSourceFlashcardsResponse } from "@toi/shared/src/schemas/source";

type FlashcardItem = GetSourceFlashcardsResponse["flashcards"][0];

type Props = {
  flashcard: FlashcardItem;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
};

export function FlashcardItem({
  flashcard,
  onSwipeLeft,
  onSwipeRight,
  className,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onSwipeLeft();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onSwipeRight();
    }
  }

  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      setDragOffset({ x: deltaX, y: deltaY });
      setRotation(deltaX * 0.1);
    }

    function handleMouseUp() {
      setIsDragging(false);

      const threshold = 100;
      if (Math.abs(dragOffset.x) > threshold) {
        if (dragOffset.x > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }

      setDragOffset({ x: 0, y: 0 });
      setRotation(0);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleTouchStart(e: React.TouchEvent) {
    setIsDragging(true);
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    function handleTouchMove(e: TouchEvent) {
      if (!isDragging) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      setDragOffset({ x: deltaX, y: deltaY });
      setRotation(deltaX * 0.1);
    }

    function handleTouchEnd() {
      setIsDragging(false);

      const threshold = 100;
      if (Math.abs(dragOffset.x) > threshold) {
        if (dragOffset.x > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }

      setDragOffset({ x: 0, y: 0 });
      setRotation(0);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  }

  const dragStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
  };

  const opacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 200);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`フラッシュカード: ${
        isFlipped ? flashcard.answer : flashcard.question
      }. Enterでフリップ、矢印キーでスワイプ`}
      className={cn(
        "relative w-80 h-48 cursor-pointer select-none transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-xl",
        isDragging && "z-10",
        className
      )}
      style={{
        ...dragStyle,
        opacity,
      }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Card container with flip animation */}
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front side (Question) */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-lg font-medium leading-relaxed">
                {flashcard.question}
              </p>
              <p className="text-blue-100 text-sm mt-4">クリックで答えを表示</p>
            </div>
          </div>
        </div>

        {/* Back side (Answer) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-lg font-medium leading-relaxed">
                {flashcard.answer}
              </p>
              <p className="text-green-100 text-sm mt-4">
                クリックで質問に戻る
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe indicators */}
      {dragOffset.x > 50 && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
          OK
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform -rotate-12">
          NG
        </div>
      )}
    </div>
  );
}
