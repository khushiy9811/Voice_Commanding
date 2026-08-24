# Voice Command Shopping Assistant

A voice-controlled shopping list manager with smart suggestions, built with React and the browser's native Web Speech API. No API keys, no backend, no build-time secrets — clone and run.

**Live demo:** https://voice-shopping-assistant-topaz-pi.vercel.app

---

## Quick start

```bash
npm install
npm run dev
```

Open the printed `localhost` URL in **Chrome or Edge** (see [Browser support](#browser-support)) and allow microphone access when prompted.

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint      # oxlint
```

---

## How it's put together

```
src/
├── components/   # MicButton, ListView, SuggestionCard, SearchResults, ToastStack, ...
├── hooks/        # useVoiceRecognition (Web Speech API wrapper), useShoppingList (state + persistence)
├── lib/          # intentParser.js, categorize.js, suggestions.js, substitutes.js, storage.js
├── data/         # categoryMap.js, seasonalItems.js, substitutesMap.js, mockCatalog.js
├── App.jsx       # wires voice input -> intent parser -> list/search/suggestion state
└── main.jsx
```

A transcript from `useVoiceRecognition` goes into `parseIntent()`, which turns it into a structured `{ intent, item, quantity, filters, ... }`. `App.jsx` dispatches that to the right handler (add/remove/search/substitute), `useShoppingList` updates state and persists to `localStorage`, and suggestions recompute off the updated list + add-history.

### Voice input

`useVoiceRecognition` (`src/hooks/useVoiceRecognition.js`) wraps the browser's `SpeechRecognition` and `SpeechSynthesis` APIs — start/stop control, a live interim transcript, and a switchable recognition `language` (English, Hindi, Spanish are wired up as a multilingual demo, see `SUPPORTED_LANGUAGES`). It surfaces distinct error states: unsupported browser, mic permission denied, no speech detected, network error.

### NLP / intent parsing

`parseIntent()` (`src/lib/intentParser.js`) is a small rule-based parser, no external dependency:
- A synonym/verb map for add-intents ("add", "need", "want", "buy", "get me", ...), remove-intents ("remove", "take off", "delete", ...), and search-intents ("find", "search for", "show me", ...), plus a few Hindi verbs.
- Regex extraction for quantity ("2 bottles of water" -> qty `2`, unit `bottle`), price filters ("under $5", "between 2 and 5"), and an `organic` flag.
- A separate trigger for substitute/preference phrasing ("milk is unavailable", "I prefer almond milk instead").
- Anything that doesn't match falls back to an add-intent, since most shopping phrases imply "add this".

I went with rules instead of calling an LLM for every command so the app stays fast and works completely offline. The parser is structured so a fuzzy LLM-fallback branch could be dropped in later without touching its call sites — just not needed for what this covers today.

### Shopping list & categorization

`useShoppingList` (`src/hooks/useShoppingList.js`) holds the list (`{ id, name, quantity, unit, category, addedAt }`) and an add-history log, both persisted to `localStorage`. `categorize()` (`src/lib/categorize.js`) maps an item name to a category via a static dictionary (`src/data/categoryMap.js`), with plural handling and an "Uncategorized" fallback.

### Smart suggestions

`src/lib/suggestions.js` combines two signals, computed client-side:
- **Frequency-based:** items added 2+ times historically that aren't currently on the list ("running low?").
- **Seasonal:** a static month-keyed table (`src/data/seasonalItems.js`) of in-season items.

`src/lib/substitutes.js` resolves a static substitutes map (`src/data/substitutesMap.js`, e.g. milk -> almond/oat/soy milk) when the parser catches "unavailable" or "prefer X instead" phrasing.

### Voice search & price filtering

`searchCatalog()` (`src/data/mockCatalog.js`) filters a small mock product catalog (name, brand, size, price, organic flag) by name/brand text and an optional min/max price — driven by the same `parseIntent()` output, so "find toothpaste under $5" and "find me organic apples" both resolve through one `search` intent with filters.

### Persistence

Everything is stored in `localStorage` (`src/lib/storage.js`) rather than a hosted database — shopping history still persists across sessions for the suggestion logic, but with zero external setup and nothing that can break for someone who just clones the repo and runs it. Swapping in a real backend later just means reimplementing the functions in `storage.js`.

---

## A few extras beyond the core list/voice/search flow

- **Voice confirmations (text-to-speech):** the app speaks back what it did ("Added milk to your list"). Toggleable via the speaker icon.
- **Manual text input fallback:** a text field next to the mic runs commands through the same `parseIntent()` pipeline, so it's usable without a microphone.
- **Pick-up checkboxes:** items can be checked off while shopping (`togglePicked`) without deleting them — closer to how a real list gets used than remove-only.
- **Estimated list total:** matches items against the mock catalog's average price and shows a running total.

---

## Error handling & loading states

- Unsupported browser, mic permission denied, no-speech, and network errors each show a distinct message via the transcript panel and a toast.
- Empty shopping list shows an empty state with example commands.
- Suggestions show a "Loading suggestions…" state while they recompute.
- `localStorage` reads are wrapped in `try/catch` and fall back to an empty list instead of crashing on corrupted data.

## Browser support

`SpeechRecognition` is only implemented in Chromium-based browsers (Chrome, Edge, Opera, Brave) — Firefox and Safari have little to no support. The rest of the app (list management, suggestions, search) still works via the +/- controls and text input without a mic, so this doesn't block usage on other browsers, just the voice part.

## Known limitations / possible next steps

- Voice recognition and synthesis need a Chromium-based browser and a working mic — that part was tested manually rather than with an automated suite.
- The NLP is rule-based rather than a trained model, so unusual phrasing can fail to parse. An LLM-fallback branch would be the natural next step.
- Multilingual support currently covers English, Hindi, and Spanish recognition; the parser's own verb/synonym map only has extra coverage for English and Hindi.
- Suggestions and the product catalog are static/local — a real version of this would back them with an actual product API and per-user cloud storage.

---

## Deployment

Deployed via the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel   # if not already installed
vercel --prod
```

No environment variables required.
