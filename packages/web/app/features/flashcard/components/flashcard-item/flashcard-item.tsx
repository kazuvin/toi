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
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const currentDragRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef(0);

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
    setIsAnimatingBack(false);
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
      } else {
        // アニメーション付きで元に戻す
        setIsAnimatingBack(true);
        setDragOffset({ x: 0, y: 0 });
        setRotation(0);
      }

      currentDragRef.current = { x: 0, y: 0 };

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      setTimeout(() => {
        hasDraggedRef.current = false;
        setIsAnimatingBack(false);
      }, 100);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    const now = Date.now();

    setIsDragging(true);
    setIsAnimatingBack(false);
    hasDraggedRef.current = false;
    touchStartTimeRef.current = now;
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

      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTimeRef.current;
      const threshold = 100;
      const finalDragX = currentDragRef.current.x;

      // タップ判定：短時間で移動が少ない場合はフリップ
      if (
        touchDuration < 200 &&
        Math.abs(finalDragX) < 10 &&
        Math.abs(currentDragRef.current.y) < 10
      ) {
        setTimeout(() => {
          handleFlip();
        }, 50);
      }

      if (Math.abs(finalDragX) > threshold) {
        if (finalDragX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      } else {
        // アニメーション付きで元に戻す
        setIsAnimatingBack(true);
        setDragOffset({ x: 0, y: 0 });
        setRotation(0);
      }

      currentDragRef.current = { x: 0, y: 0 };

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      setTimeout(() => {
        hasDraggedRef.current = false;
        setIsAnimatingBack(false);
      }, 100);
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  }

  const dragStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
  };

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

  function getProgressValue() {
    const threshold = 100;
    return Math.min(Math.abs(dragOffset.x) / threshold, 1) * 100;
  }

  function getOpacity() {
    const threshold = 150; // 透明度変化の閾値
    const dragDistance = Math.abs(dragOffset.x);
    if (dragDistance < 10) return 1; // 小さなドラッグでは透明度を変更しない

    // ドラッグ距離に応じて1から0.3まで透明度を変化させる
    const opacity = Math.max(0.3, 1 - (dragDistance / threshold) * 0.7);
    return opacity;
  }

  function CircularProgress({
    progress,
    color,
    text,
    className,
  }: {
    progress: number;
    color: string;
    text: string;
    className?: string;
  }) {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div
        className={cn(
          "absolute flex items-center justify-center w-12 h-12",
          className
        )}
      >
        <svg width="48" height="48" className="transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-100"
            strokeLinecap="round"
          />
        </svg>
        <div className={cn("absolute text-xs font-bold text-white")}>
          {text}
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`フラッシュカード: ${
        isFlipped ? flashcard.answer : flashcard.question
      }. Enterでフリップ、矢印キーでスワイプ`}
      className={cn(
        "relative w-80 aspect-square cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded",
        isDragging && "z-10",
        // アニメーション戻り時のみtransition適用
        isAnimatingBack && "transition-transform duration-300",
        className
      )}
      style={{
        ...dragStyle,
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
            className="w-full h-full bg-card rounded shadow-lg p-8 flex flex-col relative overflow-hidden"
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

            {/* 質問側のヘッダー */}
            <div className="flex items-center justify-center mb-4 relative z-10">
              <div
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full"
                style={{ opacity: getOpacity() }}
              >
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-blue-700 text-sm font-medium">質問</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center relative z-10">
                <p
                  className="text-card-foreground text-xl font-medium leading-relaxed"
                  style={{ opacity: getOpacity() }}
                >
                  {flashcard.question}
                </p>
                <p
                  className="text-muted-foreground text-sm mt-6 flex items-center justify-center gap-1"
                  style={{ opacity: getOpacity() }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                  クリックで答えを表示
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div
            className="w-full h-full bg-card rounded shadow-lg p-8 flex flex-col relative overflow-hidden"
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

            {/* 回答側のヘッダー */}
            <div className="flex items-center justify-center mb-4 relative z-10">
              <div
                className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full"
                style={{ opacity: getOpacity() }}
              >
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-700 text-sm font-medium">答え</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center relative z-10">
                <p
                  className="text-card-foreground text-xl font-medium leading-relaxed"
                  style={{ opacity: getOpacity() }}
                >
                  {flashcard.answer}
                </p>
                <p
                  className="text-muted-foreground text-sm mt-6 flex items-center justify-center gap-1"
                  style={{ opacity: getOpacity() }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  クリックで質問に戻る
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dragOffset.x > 10 && (
        <CircularProgress
          progress={getProgressValue()}
          color="white"
          text="OK"
          className="top-4 left-4"
        />
      )}
      {dragOffset.x < -10 && (
        <CircularProgress
          progress={getProgressValue()}
          color="white"
          text="NG"
          className="top-4 right-4"
        />
      )}
    </div>
  );
}
