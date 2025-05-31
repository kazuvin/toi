import { useParams } from "@remix-run/react";
import useSWR from "swr";
import { getFlashcardsBySourceId } from "~/services/flashcard";
import { useState, useRef } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export default function ContentFlashcards() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { data } = useSWR(
    id ? `/api/sources/${id}/flashcards` : null,
    async () => {
      const response = await getFlashcardsBySourceId(id!);
      return response;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const dragDistance = Math.abs(currentX);
    const isClick = dragDistance < 10;

    if (isClick) {
      setIsFlipped(!isFlipped);
    } else {
      const threshold = 100;
      // 100px以上移動したら次のカードに移動
      if (dragDistance > threshold) {
        setIsTransitioning(true);

        setTimeout(() => {
          if (currentX > 0) {
            console.log("OK");
          } else {
            console.log("NG");
          }
          setIsFlipped(false);
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      }
    }
    setCurrentX(0);
  };

  const currentCard = data?.flashcards[currentIndex];
  const nextCard = data?.flashcards[currentIndex + 1];

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-muted-foreground">
          すべてのカードを完了しました
        </p>
      </div>
    );
  }

  const transformStyle = () => {
    if (isDragging) {
      return {
        transform: `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`,
      };
    }
    return undefined;
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 mx-auto max-w-4xl w-full mb-lg py-lg">
      <div
        ref={cardRef}
        className="relative w-full max-w-md aspect-[3/4]"
        role="region"
        aria-label="フラッシュカード"
      >
        {nextCard && (
          <div
            className={cn(
              "absolute inset-0 transition-all duration-300",
              isTransitioning ? "scale-100 opacity-100" : "scale-95 opacity-50"
            )}
          >
            <div className="w-full h-full p-6 rounded-xl border border-border bg-card/30 backdrop-blur-sm flex items-center justify-center text-center">
              <p className="text-xl">{nextCard.question}</p>
            </div>
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
          )}
          role="presentation"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          <button
            className={cn("flip-card w-full h-full")}
            tabIndex={0}
            aria-label="カードをめくる"
          >
            <div
              className="flip-card-inner w-full h-full"
              style={{
                ...transformStyle(),
                transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 p-6 rounded-xl border border-border bg-card backdrop-blur-sm flex items-center justify-center text-center transition-all duration-300",
                  isFlipped ? "opacity-100" : "opacity-0"
                )}
              >
                <p className="text-xl">{currentCard.answer}</p>
              </div>
              <div
                className={cn(
                  "absolute inset-0 p-6 rounded-xl border border-border bg-card backdrop-blur-sm flex items-center justify-center text-center transition-all duration-300",
                  !isFlipped ? "opacity-100" : "opacity-0"
                )}
              >
                <p className="text-xl">{currentCard.question}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentIndex((prev) => prev + 1);
              setIsFlipped(false);
              setIsTransitioning(false);
            }, 300);
          }}
        >
          NG
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentIndex((prev) => prev + 1);
              setIsFlipped(false);
              setIsTransitioning(false);
            }, 300);
          }}
        >
          OK
        </Button>
      </div>
    </div>
  );
}
