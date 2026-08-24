import { AlertCircleIcon } from "./icons";

export default function TranscriptPanel({ transcript, isListening, error }) {
  return (
    <div className="transcript-panel" role="status" aria-live="polite">
      {error ? (
        <p className="transcript-panel__error">
          <AlertCircleIcon /> {error.message}
        </p>
      ) : transcript ? (
        <p className="transcript-panel__text">
          <span className="transcript-panel__quote">“{transcript}”</span>
        </p>
      ) : (
        <p className="transcript-panel__hint">
          {isListening ? "Listening… try “add milk” or “remove eggs.”" : "Tap the mic and try “add 2 bottles of water.”"}
        </p>
      )}
    </div>
  );
}
