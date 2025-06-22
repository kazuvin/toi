/**
 * URLに関するユーティリティ関数
 */

/**
 * 環境変数からベースURLを取得する
 * @returns ベースURL
 */
export function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  if (!baseUrl) {
    throw new Error('VITE_BASE_URL environment variable is not set');
  }
  
  return baseUrl;
}

/**
 * 指定されたパスからcanonical URLを生成する
 * @param path パス（例: "/", "/contents", "/content/123"）
 * @returns canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  
  // パスが "/"で始まらない場合は追加
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // ベースURLの末尾のスラッシュを削除してパスと結合
  return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
}