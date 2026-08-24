import { SUPPORTED_LANGUAGES } from "../hooks/useVoiceRecognition";
import { GlobeIcon } from "./icons";

export default function LanguageSelector({ language, onChange, disabled }) {
  return (
    <label className="language-selector">
      <GlobeIcon aria-hidden="true" />
      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Voice recognition language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}
