function SeoContent() {
  return (
    <section className="seo-content" aria-labelledby="about-title">
      <div className="seo-intro">
        <p className="panel-kicker">关于这个工具</p>
        <h2 id="about-title">在线中文拼音注音、朗读与多音字辅助</h2>
        <p>
          Pinyin Reader 可以把中文文本即时转换成带声调拼音的阅读稿，并结合上下文处理常见多音字。
          文本分析在浏览器本地完成，不需要上传文章到服务器。
        </p>
      </div>

      <div className="seo-feature-grid">
        <article>
          <h3>中文自动注音</h3>
          <p>粘贴中文后立即显示拼音，可调整字号和行距，也可以随时隐藏拼音。</p>
        </article>
        <article>
          <h3>多音字上下文</h3>
          <p>点击多音字查看当前读音、其他候选读音，以及现代汉语词典识别出的所在词语。</p>
        </article>
        <article>
          <h3>中文发音</h3>
          <p>使用浏览器中文语音朗读单个汉字、上下文词语或整段文本，辅助确认实际读音。</p>
        </article>
        <article>
          <h3>打印与导出</h3>
          <p>把当前阅读稿直接打印、另存为 PDF，或者导出带语义化 ruby 注音的独立 HTML。</p>
        </article>
      </div>

      <div className="seo-howto">
        <h2>如何使用 Pinyin Reader</h2>
        <ol>
          <li>在左侧输入或粘贴需要阅读的中文内容。</li>
          <li>在右侧查看拼音，点击汉字试听发音，或检查带下划线的多音字。</li>
          <li>按需要调整字号和行距，然后打印或导出阅读稿。</li>
        </ol>
      </div>
    </section>
  );
}

export default SeoContent;
