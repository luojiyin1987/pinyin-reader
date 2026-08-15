import ModernChineseDict from '@pinyin-pro/data/modern';
import { addDict, OutputFormat, pinyin, segment } from 'pinyin-pro';

addDict(ModernChineseDict, 'modern');

const HAN_CHARACTER = /\p{Script=Han}/u;

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
    const word = group.map((item) => item.origin).join('');
    const pronunciation = group.map((item) => item.result).join(' ');
    const chineseCharacterCount = Array.from(word).filter((character) =>
      HAN_CHARACTER.test(character),
    ).length;

    if (chineseCharacterCount === 0) {
      return [];
    }

    const context: WordContext | null =
      chineseCharacterCount > 1
        ? {
            word,
            pinyin: pronunciation,
          }
        : null;

    return Array.from({ length: chineseCharacterCount }, () => context);
  });
}

export { pinyin };
