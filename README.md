# Pinyin Reader

A lightweight Chinese pinyin annotation reader powered by [pinyin-pro](https://github.com/zh-lx/pinyin-pro).

## Features

- Paste or type Chinese text and see pinyin annotations instantly
- Semantic `<ruby>` / `<rt>` markup for pronunciation annotations
- Toggle pinyin visibility without changing the source text
- Adjust reading font size and line spacing
- Click polyphonic characters to inspect the contextual pronunciation and alternative readings
- Use the modern Chinese dictionary from `@pinyin-pro/data` for richer word segmentation and pronunciation context
- Show the segmented word or phrase around a selected polyphonic character when available
- Clear the editor in one click
- Runs entirely in the browser; no backend or external API is required

## Development

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

## Tech stack

- React
- TypeScript
- Vite
- pinyin-pro
- @pinyin-pro/data

## License

MIT
