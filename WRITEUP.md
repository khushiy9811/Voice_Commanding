# Approach write-up

I built this as a React (Vite) single-page app so it ships as static files to any free host with zero backend. Voice input uses the browser's native Web Speech API (`SpeechRecognition`/`SpeechSynthesis`) — free, no API key, and its `lang` property covers multilingual recognition (English, Hindi, Spanish) at no extra cost. Instead of calling an LLM for every command, I wrote a small rule-based intent parser: a synonym map (add/remove/search verbs, including a few Hindi equivalents) plus regex extraction for quantities, units, and price ranges. That keeps the app fast, fully offline-capable, and free to run, while still handling common phrasings correctly. An LLM fallback is an easy extension if fuzzier phrasing needs covering later.

Smart suggestions combine two static/local signals: frequency of past adds (from `localStorage`-persisted history) for "running low" recommendations, and a month-keyed seasonal table. Substitutes use a static map triggered by "unavailable"/"prefer X instead" phrasing.

Main known limitation: the NLP is pattern-based rather than a trained model, so unusual phrasing can fail to parse — the parser is structured so an LLM fallback branch could be added later without touching its call sites.
