import type { MetaFunction } from "@remix-run/node";
import AppBar from "~/components/layout/app-bar";
import Sidebar from "~/components/layout/sidebar";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <AppBar className="fixed top-0 left-0 right-0 z-50" />
      <main className="fixed top-global-header-height left-0 bottom-0">
        <Sidebar className="absolute top-0 left-0 bottom-0 z-40" />
        <div className="absolute top-0 left-global-sidebar-width bottom-0 flex flex-col flex-1 w-[calc(100vw-var(--global-sidebar-width))]">
          <div className="flex flex-col flex-1 items-center gap-md mr-lg mb-lg p-lg rounded bg-card">
            <h1 className="text-4xl mt-lg">新しく問題集を作成しましょう。</h1>
            <div className="mb-lg text-sm py-sm px-md rounded border border-border text-muted-foreground">
              無料プラン
            </div>
            <div className="mb-lg flex w-full items-center justify-center gap-lg">
              <div className="flex-1">
                <div className="text-sm font-medium mb-sm">
                  テキストから作る
                </div>
                <div className="relative">
                  <textarea
                    placeholder="学習内容を入力..."
                    className="w-full h-64 rounded border border-input bg-muted p-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-md right-md"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        const textarea = document.querySelector("textarea");
                        if (textarea) {
                          textarea.value = text;
                        }
                      } catch (err) {
                        console.error(
                          "クリップボードからの読み取りに失敗しました:",
                          err
                        );
                      }
                    }}
                  >
                    クリップボードからペースト
                  </Button>
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                or
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-sm">
                  ファイルから作る
                </div>
                <div className="w-full h-64 rounded border border-dashed border-input bg-muted p-md flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-sm">
                      ファイルをドラッグ＆ドロップ
                    </div>
                    <div className="text-sm text-muted-foreground">または</div>
                    <Button variant="outline" className="mt-sm">
                      ファイルを選択
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button>問題集を作る</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
