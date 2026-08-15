import ModernChineseDict from '@pinyin-pro/data/modern';
import { addDict, OutputFormat, pinyin, segment } from 'pinyin-pro';

addDict(ModernChineseDict, 'modern');

export interface WordContext {
  word: string;
  pinyin: string;
}

export function getWordContexts(text: string): Array<WordContext | null> {
  const groups = segment(text, {
    format: OutputFormat.AllArray,
    nonZh: 'consecutive',
  });

  return groups.flatMap((group) => {
    const firstItem = group[0];

    if (!firstItem) {
      return [];
    }

    const firstItemInfo = pinyin(firstItem.origin, {
      type: 'all',
      nonZh: 'consecutive',
    })[0];

    if (!firstItemInfo?.isZh) {
      return [];
    }

    const context: WordContext | null =
      group.length > 1
        ? {
            word: group.map((item) => item.origin).join(''),
            pinyin: group.map((item) => item.result).join(' '),
          }
        : null;

    return group.map(() => context);
  });
}

export { pinyin };
