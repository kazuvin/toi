import { useEffect, useState, useRef } from "react";
import { cn } from "~/lib/utils";

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  gravity: number;
  initialVelocityY: number;
  phase: 'launch' | 'fall';
};

type Props = {
  active: boolean;
  className?: string;
};

export function Confetti({ active, className }: Props) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    // サイズを取得（レイアウトシフト防止のため遅延初期化）
    const initializeConfetti = () => {
      const container = containerRef.current;
      const centerX = container ? container.offsetWidth / 2 : window.innerWidth / 2;
      const containerHeight = container ? container.offsetHeight : window.innerHeight;

      // カラフルな色の配列
      const colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
      ];

      // 紙吹雪の生成（画面下から打ち上げ）
      const newPieces: ConfettiPiece[] = [];
      
      for (let i = 0; i < 50; i++) {
        const initialVelocityY = -15 - Math.random() * 10; // 強い上向きの初速
        newPieces.push({
          id: i,
          x: centerX + (Math.random() - 0.5) * 200, // 中央から左右に散らばる
          y: containerHeight - 10, // 画面下から開始（画面内から開始に変更）
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocityX: (Math.random() - 0.5) * 8, // 横方向の散らばり
          velocityY: initialVelocityY,
          rotationSpeed: (Math.random() - 0.5) * 8,
          gravity: 0.3 + Math.random() * 0.2, // 重力加速度
          initialVelocityY,
          phase: 'launch',
        });
      }

      setPieces(newPieces);

      // アニメーションループ（requestAnimationFrameを使用してレイアウトシフトを防止）
      let animationId: number;
      const animateConfetti = () => {
        setPieces((currentPieces) => {
          return currentPieces
            .map((piece) => {
              let newPhase = piece.phase;
              let newVelocityX = piece.velocityX;
              const newVelocityY = piece.velocityY + piece.gravity; // 重力を適用
              
              // 上昇から落下への切り替え
              if (piece.phase === 'launch' && newVelocityY >= 0) {
                newPhase = 'fall';
                // 落下時にひらひら効果を追加
                newVelocityX = piece.velocityX * 0.8 + (Math.random() - 0.5) * 2;
              }
              
              // 落下時のひらひら効果
              if (newPhase === 'fall') {
                newVelocityX += (Math.random() - 0.5) * 0.5; // 微細な横揺れ
              }
              
              return {
                ...piece,
                x: piece.x + newVelocityX,
                y: piece.y + newVelocityY,
                rotation: piece.rotation + piece.rotationSpeed,
                velocityX: newVelocityX,
                velocityY: newVelocityY,
                phase: newPhase,
              };
            })
            .filter((piece) => piece.y < containerHeight + 100); // 画面外に出たら削除
        });
        
        animationId = requestAnimationFrame(animateConfetti);
      };

      animationId = requestAnimationFrame(animateConfetti);

      // 7秒後に自動クリア（打ち上げ効果を十分楽しめるように）
      const timeout = setTimeout(() => {
        setPieces([]);
        cancelAnimationFrame(animationId);
      }, 7000);

      return () => {
        cancelAnimationFrame(animationId);
        clearTimeout(timeout);
      };
    };

    // 少し遅延してから初期化（DOMの準備を待つ）
    const timeoutId = setTimeout(initializeConfetti, 10);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [active]);

  if (!active || pieces.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={cn("fixed inset-0 pointer-events-none z-50", className)}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 opacity-90"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            backgroundColor: piece.color,
            borderRadius: "2px",
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}