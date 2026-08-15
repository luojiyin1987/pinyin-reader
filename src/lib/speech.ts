interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
}

let activeRequestId = 0;

export function supportsChineseSpeech() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

function getPreferredChineseVoice() {
  if (!supportsChineseSpeech()) return null;

  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn') ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('zh')) ??
    null
  );
}

export function speakChinese(text: string, callbacks: SpeechCallbacks = {}) {
  if (!supportsChineseSpeech()) return false;

  const content = text.trim();
  if (!content) return false;

  const requestId = ++activeRequestId;
  const synthesis = window.speechSynthesis;
  synthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = 'zh-CN';
  utterance.rate = 1;

  const voice = getPreferredChineseVoice();
  if (voice) {
    utterance.voice = voice;
  }

  let finished = false;
  const finish = () => {
    if (finished || requestId !== activeRequestId) return;
    finished = true;
    callbacks.onEnd?.();
  };

  utterance.onstart = () => {
    if (requestId === activeRequestId) {
      callbacks.onStart?.();
    }
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  synthesis.speak(utterance);
  return true;
}

export function stopChineseSpeech() {
  activeRequestId += 1;

  if (supportsChineseSpeech()) {
    window.speechSynthesis.cancel();
  }
}
