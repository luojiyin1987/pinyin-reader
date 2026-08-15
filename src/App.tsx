import { useState } from 'react';
import PinyinText from './components/PinyinText';

const EXAMPLE_TEXT = '小明今天去了重庆，然后坐地铁去了银行。';

function App() {
  const [text, setText] = useState(EXAMPLE_TEXT);
  const [showPinyin, setShowPinyin] = useState(true);

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
            onChange={(event) => setText(event.target.value)}
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
              onClick={() => setText('')}
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

          <div className="reader-output" aria-live="polite">
            {text ? (
              <PinyinText text={text} showPinyin={showPinyin} />
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
