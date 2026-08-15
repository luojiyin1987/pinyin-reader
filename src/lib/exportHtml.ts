import { pinyin } from './pinyin';

export type ReaderSize = 'small' | 'medium' | 'large';
export type ReaderSpacing = 'compact' | 'comfortable' | 'relaxed';

interface ExportHtmlOptions {
  text: string;
  showPinyin: boolean;
  readerSize: ReaderSize;
  readerSpacing: ReaderSpacing;
}

const FONT_SIZES: Record<ReaderSize, string> = {
  small: '1.45rem',
  medium: '1.8rem',
  large: '2.25rem',
};

const LINE_HEIGHTS: Record<ReaderSpacing, string> = {
  compact: '1.95',
  comfortable: '2.35',
  relaxed: '2.75',
};

const HIDDEN_LINE_HEIGHTS: Record<ReaderSpacing, string> = {
  compact: '1.65',
  comfortable: '1.9',
  relaxed: '2.15',
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] ?? character,
  );
}

export function createAnnotatedHtml({
  text,
  showPinyin,
  readerSize,
  readerSpacing,
}: ExportHtmlOptions) {
  const items = pinyin(text, {
    type: 'all',
    nonZh: 'consecutive',
    segmentit: 2,
  });

  const annotatedText = items
    .map((item) => {
      if (!item.isZh) {
        return `<span class="non-chinese">${escapeHtml(item.origin)}</span>`;
      }

      const annotation = showPinyin
        ? `<rt>${escapeHtml(item.pinyin)}</rt>`
        : '';

      return `<ruby><span>${escapeHtml(item.origin)}</span>${annotation}</ruby>`;
    })
    .join('');

  const lineHeight = showPinyin
    ? LINE_HEIGHTS[readerSpacing]
    : HIDDEN_LINE_HEIGHTS[readerSpacing];

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pinyin Reader 导出</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #1f2923;
      background: #ffffff;
      font-family: "Noto Serif SC", "Songti SC", SimSun, serif;
    }
    main {
      width: min(820px, calc(100% - 40px));
      margin: 0 auto;
      padding: 48px 0;
    }
    .reader {
      margin: 0;
      font-size: ${FONT_SIZES[readerSize]};
      line-height: ${lineHeight};
      word-break: break-word;
    }
    ruby {
      margin-inline: 0.08em;
      ruby-align: center;
    }
    rt {
      color: #50705e;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 0.43em;
      font-weight: 620;
      letter-spacing: 0.01em;
    }
    .non-chinese { white-space: pre-wrap; }
    @media print {
      @page { margin: 16mm; }
      main { width: auto; padding: 0; }
      rt { color: #000000; }
    }
  </style>
</head>
<body>
  <main>
    <p class="reader">${annotatedText}</p>
  </main>
</body>
</html>`;
}

export function downloadAnnotatedHtml(options: ExportHtmlOptions) {
  const html = createAnnotatedHtml(options);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'pinyin-reader.html';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
