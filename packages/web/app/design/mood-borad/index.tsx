import React from "react";

export const MoodBoard: React.FC = () => {
  const title = "Mood Board";
  const images = [
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  ];

  return (
    <div className="p-12 bg-background rounded h-full">
      <h2 className="text-5xl font-bold mb-12 text-center text-foreground">
        {title}
      </h2>

      <div className="grid grid-cols-12 gap-xl">
        {/* メイン画像エリア */}
        <div className="col-span-8">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative ${
                    index === 0 ? "col-span-2" : "col-span-1"
                  }`}
                >
                  <div className="relative pt-[75%] rounded overflow-hidden bg-card">
                    <img
                      src={image}
                      alt={`Inspiration ${index + 1}`}
                      className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div className="col-span-4 space-y-xl">
          <div className="bg-card p-6 rounded">
            <h3 className="text-lg font-bold mb-6 text-card-foreground">
              カラーパレット
            </h3>
            <div className="grid grid-cols-2 gap-md">
              <div className="space-y-sm">
                <div className="bg-primary aspect-square rounded hover:scale-105 transition-transform duration-300 flex items-center justify-center text-5xl text-primary-foreground">
                  あ
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Primary
                </p>
              </div>
              <div className="space-y-sm">
                <div className="bg-secondary aspect-square rounded hover:scale-105 transition-transform duration-300 flex items-center justify-center text-5xl text-secondary-foreground">
                  あ
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Secondary
                </p>
              </div>
              <div className="space-y-sm">
                <div className="bg-muted aspect-square rounded hover:scale-105 transition-transform duration-300 flex items-center justify-center text-5xl text-muted-foreground">
                  あ
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Muted
                </p>
              </div>
              <div className="space-y-sm">
                <div className="bg-accent-gradient aspect-square rounded hover:scale-105 transition-transform duration-300 flex items-center justify-center text-5xl text-accent-foreground">
                  あ
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Accent
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded">
            <h3 className="text-lg font-bold mb-6 text-card-foreground">
              タイポグラフィ
            </h3>
            <div className="space-y-md">
              <div className="p-4 bg-muted rounded">
                <h4 className="text-xl font-bold text-muted-foreground">
                  Noto Sans JP
                </h4>
                <p className="text-sm text-muted-foreground font-normal">
                  見出しフォント
                </p>
              </div>
              <div className="p-4 bg-muted rounded">
                <p className="text-base font-normal text-muted-foreground">
                  Noto Sans JP
                </p>
                <p className="text-sm text-muted-foreground font-normal">
                  本文フォント
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;
