import { useState } from "react";
import { SendIcon } from "./icons";

export default function TextCommandInput({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form className="text-command" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Or type a command, e.g. "add 2 apples"'
        aria-label="Type a shopping command"
      />
      <button type="submit" aria-label="Submit command" disabled={!value.trim()}>
        <SendIcon />
      </button>
    </form>
  );
}
