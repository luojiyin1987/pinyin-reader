import { useState } from 'react';
import PinyinText, {
  type PolyphonicSelection,
} from './components/PinyinText';

const EXAMPLE_TEXT = '小明今天去了重庆，然后坐地铁去了银行。';

type ReaderSize = 'small' | 'medium' | 'large';
type ReaderSpacing = 'compact' | 'comfortable' | 'relaxed';

const SIZE_OPTIONS: Array<{ value: ReaderSize; label: string }> = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
];

const SPACING_OPTIONS: Array<{ value: ReaderSpacing; label: string }> = [
  { value: 'compact', label: '紧凑' },
  { value: 'comfortable', label: '舒适' },
  { value: 'relaxed', label: '宽松' },
];

function App() {
  const [text, setText] = useState(EXAMPLE_TEXT);
  const [showPinyin, setShowPinyin] = useState(true);
  const [readerSize, setReaderSize] = useState<ReaderSize>('medium');
  const [readerSpacing, setReaderSpacing] = useState<ReaderSpacing>('comfortable');
  const [selectedPolyphonic, setSelectedPolyphonic] =
    useState<PolyphonicSelection | null>(null);

  const otherPronunciations =
    selectedPolyphonic?.pronunciations.filter(
      (pronunciation) => pronunciation !== selectedPolyphonic.current,
    ) ?? [];

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">PINYIN READER</p>
        <h1 id="page-title">中文拼音注音阅读器</h1>
        <p className="subtitle">
          输入中文，即时生成带拼音的阅读文本。所有转换都在浏览器本地完成。
        </p>
      </section>

      <section className="workspace" aria-label="拼音注音工具">
        <div className="panel editor-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">输入</p>
              <h2>中文文本</h2>
            </div>
            <span className="character-count">{text.length} 字符</span>
          </div>

          <label className="sr-only" htmlFor="source-text">
            要添加拼音注音的中文文本
          </label>
          <textarea
            id="source-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setSelectedPolyphonic(null);
            }}
            placeholder="在这里输入或粘贴中文……"
            spellCheck={false}
          />

          <div className="toolbar">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setShowPinyin((visible) => !visible)}
              aria-pressed={showPinyin}
            >
              {showPinyin ? '隐藏拼音' : '显示拼音'}
            </button>
            <button
              className="button button-ghost"
              type="button"
              onClick={() => {
                setText('');
                setSelectedPolyphonic(null);
              }}
              disabled={!text}
            >
              清空
            </button>
          </div>
        </div>

        <div className="panel reader-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">阅读</p>
              <h2>注音结果</h2>
            </div>
            <span className="local-badge">本地处理</span>
          </div>

          <div className="reader-controls" aria-label="阅读设置">
            <fieldset className="control-group">
              <legend>字号</legend>
              <div className="segmented-control">
                {SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className="segment-button"
                    type="button"
                    aria-pressed={readerSize === option.value}
                    onClick={() => setReaderSize(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="control-group">
              <legend>行距</legend>
              <div className="segmented-control">
                {SPACING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className="segment-button"
                    type="button"
                    aria-pressed={readerSpacing === option.value}
                    onClick={() => setReaderSpacing(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <p className="reader-hint">
            带下划线的多音字可点击查看所在词语和读音详情。
          </p>

          <div
            className={`reader-output reader-size-${readerSize} reader-spacing-${readerSpacing}`}
          >
            {text ? (
              <>
                <PinyinText
                  text={text}
                  showPinyin={showPinyin}
                  selectedIndex={selectedPolyphonic?.index ?? null}
                  onSelectPolyphonic={setSelectedPolyphonic}
                />

                {selectedPolyphonic && (
                  <aside
                    className="polyphonic-details"
                    aria-label={`${selectedPolyphonic.character}的多音字详情`}
                    aria-live="polite"
                  >
                    <button
                      className="polyphonic-close"
                      type="button"
                      aria-label="关闭多音字详情"
                      onClick={() => setSelectedPolyphonic(null)}
                    >
                      ×
                    </button>
                    <div className="polyphonic-character" aria-hidden="true">
                      {selectedPolyphonic.character}
                    </div>
                    <div className="polyphonic-detail-content">
                      {selectedPolyphonic.context && (
                        <div className="word-context">
                          <p className="detail-label">所在词语</p>
                          <div className="word-context-value">
                            <strong>{selectedPolyphonic.context.word}</strong>
                            <span>{selectedPolyphonic.context.pinyin}</span>
                          </div>
                        </div>
                      )}

                      <p className="detail-label">上下文读音</p>
                      <p className="detail-current">{selectedPolyphonic.current}</p>
                      <div className="alternative-pronunciations">
                        <span className="detail-label">其他读音</span>
                        <div className="pronunciation-list">
                          {otherPronunciations.map((pronunciation) => (
                            <span className="pronunciation-chip" key={pronunciation}>
                              {pronunciation}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="detail-note">
                        词语边界和当前读音使用现代汉语扩展词典结合整句上下文识别。
                      </p>
                    </div>
                  </aside>
                )}
              </>
            ) : (
              <p className="empty-state">输入中文后，拼音注音会显示在这里。</p>
            )}
          </div>
        </div>
      </section>

      <footer>
        Powered by <a href="https://github.com/zh-lx/pinyin-pro">pinyin-pro</a>
      </footer>
    </main>
  );
}

export default App;
