import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognitionImpl =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const SUPPORTED_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "es-ES", label: "Spanish" },
];

// Wraps the browser SpeechRecognition API into a small hook: start/stop
// control, live transcript, permission/support errors, and switchable
// recognition language (multilingual support). Speech *output* lives in
// lib/speech.js so it can be triggered independently of recognition state.
export function useVoiceRecognition({ onResult, defaultLang = "en-US" } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(() =>
    SpeechRecognitionImpl
      ? null
      : { code: "unsupported", message: "Speech recognition is not supported in this browser. Try Chrome or Edge." }
  );
  const [language, setLanguage] = useState(defaultLang);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);

  const isSupported = Boolean(SpeechRecognitionImpl);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      setTranscript(finalText || interimText);
      if (finalText && onResultRef.current) {
        onResultRef.current(finalText.trim(), language);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setError({ code: "permission-denied", message: "Microphone permission was denied. Allow mic access to use voice commands." });
      } else if (event.error === "no-speech") {
        setError({ code: "no-speech", message: "No speech detected. Try again." });
      } else if (event.error === "network") {
        setError({ code: "network", message: "Network error during speech recognition. Check your connection." });
      } else {
        setError({ code: event.error || "unknown", message: "Something went wrong with voice recognition." });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, [isSupported, language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setError(null);
    try {
      recognitionRef.current.start();
    } catch {
      // start() throws if already started; ignore.
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    language,
    setLanguage,
    startListening,
    stopListening,
  };
}
