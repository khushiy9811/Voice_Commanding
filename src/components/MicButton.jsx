import { MicIcon, StopIcon } from "./icons";

export default function MicButton({ isListening, isSupported, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`mic-button ${isListening ? "mic-button--listening" : ""}`}
      onClick={onToggle}
      disabled={!isSupported || disabled}
      aria-pressed={isListening}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      <span className="mic-button__ring" aria-hidden="true" />
      <span className="mic-button__icon" aria-hidden="true">
        {isListening ? <StopIcon /> : <MicIcon />}
      </span>
      <span className="mic-button__label">
        {!isSupported ? "Unsupported" : isListening ? "Listening…" : "Tap to speak"}
      </span>
    </button>
  );
}
