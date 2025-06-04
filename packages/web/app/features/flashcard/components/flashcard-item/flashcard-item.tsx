import { useState, useRef } from "react";
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
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const currentDragRef = useRef({ x: 0, y: 0 });

  function handleFlip() {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
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
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    currentDragRef.current = { x: 0, y: 0 };

    function handleMouseMove(e: MouseEvent) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      currentDragRef.current = { x: deltaX, y: deltaY };

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDraggedRef.current = true;
      }

      setDragOffset({ x: deltaX, y: deltaY });
      setRotation(deltaX * 0.1);
    }

    function handleMouseUp() {
      setIsDragging(false);

      const threshold = 100;
      const finalDragX = currentDragRef.current.x;

      if (Math.abs(finalDragX) > threshold) {
        if (finalDragX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }

      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      currentDragRef.current = { x: 0, y: 0 };

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    currentDragRef.current = { x: 0, y: 0 };

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      currentDragRef.current = { x: deltaX, y: deltaY };

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDraggedRef.current = true;
      }

      setDragOffset({ x: deltaX, y: deltaY });
      setRotation(deltaX * 0.1);
    }

    function handleTouchEnd(e: TouchEvent) {
      e.preventDefault();
      setIsDragging(false);

      const threshold = 100;
      const finalDragX = currentDragRef.current.x;

      if (Math.abs(finalDragX) > threshold) {
        if (finalDragX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }

      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      currentDragRef.current = { x: 0, y: 0 };

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  }

  const dragStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
  };

  const opacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 200);

  function getBackgroundOverlay() {
    if (Math.abs(dragOffset.x) < 10) return "";

    const maxDrag = 150;
    const intensity = Math.min(Math.abs(dragOffset.x) / maxDrag, 0.7);

    if (dragOffset.x > 0) {
      return `rgba(34, 197, 94, ${intensity})`;
    } else {
      return `rgba(239, 68, 68, ${intensity})`;
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`フラッシュカード: ${
        isFlipped ? flashcard.answer : flashcard.question
      }. Enterでフリップ、矢印キーでスワイプ`}
      className={cn(
        "relative size-96 cursor-pointer select-none transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded",
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
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div
            className="w-full h-full bg-card rounded shadow-lg p-8 flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: getBackgroundOverlay() || undefined,
              backgroundImage: getBackgroundOverlay()
                ? "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.9))"
                : undefined,
              backgroundBlendMode: getBackgroundOverlay()
                ? "overlay"
                : undefined,
            }}
          >
            {getBackgroundOverlay() && (
              <div
                className="absolute inset-0 rounded"
                style={{
                  backgroundColor: getBackgroundOverlay(),
                }}
              />
            )}
            <div className="text-center relative z-10">
              <p className="text-card-foreground text-xl font-medium leading-relaxed">
                {flashcard.question}
              </p>
              <p className="text-muted-foreground text-sm mt-6">
                クリックで答えを表示
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div
            className="w-full h-full bg-card rounded shadow-lg p-8 flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: getBackgroundOverlay() || undefined,
              backgroundImage: getBackgroundOverlay()
                ? "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.9))"
                : undefined,
              backgroundBlendMode: getBackgroundOverlay()
                ? "overlay"
                : undefined,
            }}
          >
            {getBackgroundOverlay() && (
              <div
                className="absolute inset-0 rounded"
                style={{
                  backgroundColor: getBackgroundOverlay(),
                }}
              />
            )}
            <div className="text-center relative z-10">
              <p className="text-card-foreground text-xl font-medium leading-relaxed">
                {flashcard.answer}
              </p>
              <p className="text-muted-foreground text-sm mt-6">
                クリックで質問に戻る
              </p>
            </div>
          </div>
        </div>
      </div>

      {dragOffset.x > 50 && (
        <div className="absolute top-6 right-6 bg-white text-green-600 px-4 py-2 rounded-full text-base font-bold transform rotate-12 shadow-lg border-2 border-green-500">
          OK
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute top-6 left-6 bg-white text-red-600 px-4 py-2 rounded-full text-base font-bold transform -rotate-12 shadow-lg border-2 border-red-500">
          NG
        </div>
      )}
    </div>
  );
}
