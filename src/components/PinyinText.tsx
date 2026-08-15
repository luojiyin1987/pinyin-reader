import { useEffect, useMemo, useRef } from 'react';
import { getWordContexts, pinyin, type WordContext } from '../lib/pinyin';

export type PolyphonicContextState = 'loading' | 'ready' | 'error';

export interface PolyphonicSelection {
  index: number;
  character: string;
  current: string;
  pronunciations: string[];
  context: WordContext | null;
  contextState: PolyphonicContextState;
}

interface PinyinTextProps {
  text: string;
  showPinyin: boolean;
  selectedIndex: number | null;
  onSelectPolyphonic: (selection: PolyphonicSelection) => void;
  onSpeak?: (text: string) => void;
}

function PinyinText({
  text,
  showPinyin,
  selectedIndex,
  onSelectPolyphonic,
  onSpeak,
}: PinyinTextProps) {
  const items = useMemo(
    () =>
      pinyin(text, {
        type: 'all',
        nonZh: 'consecutive',
        segmentit: 2,
      }),
    [text],
  );
  const contextRequestRef = useRef(0);

  useEffect(() => {
    contextRequestRef.current += 1;
  }, [text]);

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

        const contextIndex = chineseIndex;
        chineseIndex += 1;

        const pronunciations = Array.from(new Set(item.polyphonic));
        const isPolyphonic = pronunciations.length > 1;
        const isSelected = selectedIndex === index;

        const selectPolyphonic = async () => {
          const requestId = contextRequestRef.current + 1;
          contextRequestRef.current = requestId;
          const baseSelection = {
            index,
            character: item.origin,
            current: item.pinyin,
            pronunciations,
            context: null,
          };

          onSelectPolyphonic({
            ...baseSelection,
            contextState: 'loading',
          });

          try {
            const wordContexts = await getWordContexts(text);

            if (contextRequestRef.current !== requestId) {
              return;
            }

            onSelectPolyphonic({
              ...baseSelection,
              context: wordContexts[contextIndex] ?? null,
              contextState: 'ready',
            });
          } catch {
            if (contextRequestRef.current !== requestId) {
              return;
            }

            onSelectPolyphonic({
              ...baseSelection,
              contextState: 'error',
            });
          }
        };

        return (
          <ruby
            className={isPolyphonic ? 'polyphonic-ruby' : undefined}
            key={`${item.origin}-${index}`}
          >
            {isPolyphonic ? (
              <button
                className="hanzi polyphonic-trigger"
                type="button"
                aria-label={`${item.origin}是多音字，当前读音${item.pinyin}，点击查看其他读音和词语上下文`}
                aria-pressed={isSelected}
                onClick={selectPolyphonic}
              >
                {item.origin}
              </button>
            ) : onSpeak ? (
              <button
                className="hanzi hanzi-speak-trigger"
                type="button"
                aria-label={`朗读汉字${item.origin}`}
                title="点击朗读"
                onClick={() => onSpeak(item.origin)}
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
