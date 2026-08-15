import { useMemo } from 'react';
import { getWordContexts, pinyin, type WordContext } from '../lib/pinyin';

export interface PolyphonicSelection {
  index: number;
  character: string;
  current: string;
  pronunciations: string[];
  context: WordContext | null;
}

interface PinyinTextProps {
  text: string;
  showPinyin: boolean;
  selectedIndex: number | null;
  onSelectPolyphonic: (selection: PolyphonicSelection) => void;
}

function PinyinText({
  text,
  showPinyin,
  selectedIndex,
  onSelectPolyphonic,
}: PinyinTextProps) {
  const { items, wordContexts } = useMemo(
    () => ({
      items: pinyin(text, {
        type: 'all',
        nonZh: 'consecutive',
      }),
      wordContexts: getWordContexts(text),
    }),
    [text],
  );

  let chineseIndex = 0;

  return (
    <p className={`pinyin-text${showPinyin ? '' : ' pinyin-hidden'}`}>
      {items.map((item, index) => {
        if (!item.isZh) {
          return (
            <span className="non-chinese" key={`${item.origin}-${index}`}>
              {item.origin}
            </span>
          );
        }

        const context = wordContexts[chineseIndex] ?? null;
        chineseIndex += 1;

        const pronunciations = Array.from(new Set(item.polyphonic));
        const isPolyphonic = pronunciations.length > 1;
        const isSelected = selectedIndex === index;

        return (
          <ruby
            className={isPolyphonic ? 'polyphonic-ruby' : undefined}
            key={`${item.origin}-${index}`}
          >
            {isPolyphonic ? (
              <button
                className="hanzi polyphonic-trigger"
                type="button"
                aria-label={`${item.origin}是多音字，当前读音${item.pinyin}，点击查看其他读音${
                  context ? `和所在词语${context.word}` : ''
                }`}
                aria-pressed={isSelected}
                onClick={() =>
                  onSelectPolyphonic({
                    index,
                    character: item.origin,
                    current: item.pinyin,
                    pronunciations,
                    context,
                  })
                }
              >
                {item.origin}
              </button>
            ) : (
              <span className="hanzi">{item.origin}</span>
            )}
            {showPinyin && <rt>{item.pinyin}</rt>}
          </ruby>
        );
      })}
    </p>
  );
}

export default PinyinText;
