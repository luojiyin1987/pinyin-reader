# Pinyin Reader

A lightweight Chinese pinyin annotation reader powered by [pinyin-pro](https://github.com/zh-lx/pinyin-pro).

## Features

- Paste or type Chinese text and see pinyin annotations instantly
- Semantic `<ruby>` / `<rt>` markup for pronunciation annotations
- Toggle pinyin visibility without changing the source text
- Adjust reading font size and line spacing
- Click ordinary Chinese characters to hear their pronunciation with the browser speech engine
- Read the full passage aloud and stop or restart playback
- Click polyphonic characters to inspect the contextual pronunciation and alternative readings
- Pronounce the segmented word around a selected polyphonic character when available
- Use the modern Chinese dictionary from `@pinyin-pro/data` for richer word segmentation and pronunciation context
- Show the segmented word or phrase around a selected polyphonic character when available
- Print a clean reading sheet using the current pinyin, font-size, and spacing preferences
- Export a standalone HTML reading sheet with inline styles and semantic ruby annotations
- Clear the editor in one click
- Runs entirely in the browser; no backend or external API is required

Speech uses the browser Web Speech API (`speechSynthesis`). Chinese voice availability and voice quality depend on the user's browser and operating system.

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
- Web Speech API

## License

MIT
