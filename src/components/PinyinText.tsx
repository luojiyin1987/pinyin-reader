import { pinyin } from 'pinyin-pro';

interface PinyinTextProps {
  text: string;
  showPinyin: boolean;
}

function PinyinText({ text, showPinyin }: PinyinTextProps) {
  const items = pinyin(text, {
    type: 'all',
    nonZh: 'consecutive',
  });

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

        return (
          <ruby key={`${item.origin}-${index}`}>
            <span className="hanzi">{item.origin}</span>
            {showPinyin && <rt>{item.pinyin}</rt>}
          </ruby>
        );
      })}
    </p>
  );
}

export default PinyinText;
