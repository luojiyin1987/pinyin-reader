import { addDict, OutputFormat, pinyin, segment } from 'pinyin-pro';

export interface WordContext {
  word: string;
  pinyin: string;
}

let modernDictionaryPromise: Promise<void> | null = null;

async function loadModernDictionary() {
  if (!modernDictionaryPromise) {
    modernDictionaryPromise = import('@pinyin-pro/data/modern')
      .then(({ default: ModernChineseDict }) => {
        addDict(ModernChineseDict, 'modern');
      })
      .catch((error) => {
        modernDictionaryPromise = null;
        throw error;
      });
  }

  return modernDictionaryPromise;
}

export async function getWordContexts(
  text: string,
): Promise<Array<WordContext | null>> {
  await loadModernDictionary();

  const groups = segment(text, {
    format: OutputFormat.AllArray,
    nonZh: 'consecutive',
    segmentit: 2,
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
