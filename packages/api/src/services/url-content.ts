export async function fetchContentFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // HTML から本文テキストを抽出
    const textContent = extractTextFromHtml(html);
    
    if (!textContent.trim()) {
      throw new Error("テキストコンテンツが見つかりませんでした");
    }

    return textContent;
  } catch (error) {
    console.error("URL コンテンツ取得エラー:", error);
    throw error;
  }
}

function extractTextFromHtml(html: string): string {
  // script と style タグを削除
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 主要コンテンツエリアを優先的に抽出
  const contentSelectors = [
    /<main[^>]*>([\s\S]*?)<\/main>/gi,
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
  ];

  let extractedContent = '';
  for (const selector of contentSelectors) {
    const matches = content.match(selector);
    if (matches && matches.length > 0) {
      extractedContent = matches.join(' ');
      break;
    }
  }

  // メインコンテンツが見つからない場合は全体を使用
  if (!extractedContent) {
    extractedContent = content;
  }

  // HTMLタグを削除
  extractedContent = extractedContent.replace(/<[^>]*>/g, '');
  
  // 空白文字を正規化
  extractedContent = extractedContent
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();

  return extractedContent;
}