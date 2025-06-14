/**
 * YouTube動画のコンテンツを取得するサービス
 */

/**
 * YouTube動画のURLから動画IDを抽出する
 */
function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * YouTube動画からテキストコンテンツを抽出する
 * 注: 実際の実装では、YouTube Data API v3を使用して字幕やタイトル・説明文を取得する
 */
export async function extractTextFromYoutube(url: string): Promise<string> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error("無効なYouTube URLです");
    }

    // TODO: 実際の実装ではYouTube Data API v3を使用
    // 1. 動画の基本情報(タイトル、説明文)を取得
    // 2. 字幕/キャプションがあれば取得
    // 3. テキストとして結合して返す
    
    // 現在はプレースホルダーとして固定テキストを返す
    return `YouTube動画のサンプルコンテンツです。
    
動画URL: ${url}
動画ID: ${videoId}

これは学習用のサンプルテキストです。実際の実装では、YouTube Data API v3を使用して以下の情報を取得します：
- 動画のタイトル
- 動画の説明文
- 自動生成字幕または手動字幕
- チャプター情報（利用可能な場合）

このテキストからフラッシュカードが生成されます。`;
    
  } catch (error) {
    console.error("YouTube動画の処理中にエラーが発生しました:", error);
    throw new Error("YouTube動画の処理に失敗しました");
  }
}