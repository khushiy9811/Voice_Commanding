// Standalone speech-synthesis helper, decoupled from the recognition hook so
// it can be triggered from any command source (voice or typed text).
export function speakText(text, lang = "en-US") {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
