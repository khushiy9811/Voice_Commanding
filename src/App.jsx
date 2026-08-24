import { useCallback, useEffect, useMemo, useState } from "react";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";
import { useShoppingList } from "./hooks/useShoppingList";
import { parseIntent } from "./lib/intentParser";
import { getAllSuggestions } from "./lib/suggestions";
import { resolveSubstitutes } from "./lib/substitutes";
import { searchCatalog } from "./data/mockCatalog";
import { speakText } from "./lib/speech";
import { estimateListTotal } from "./lib/pricing";
import MicButton from "./components/MicButton";
import LanguageSelector from "./components/LanguageSelector";
import TranscriptPanel from "./components/TranscriptPanel";
import ToastStack from "./components/ToastStack";
import ListView from "./components/ListView";
import ListTotal from "./components/ListTotal";
import SuggestionCard from "./components/SuggestionCard";
import SearchResults from "./components/SearchResults";
import TextCommandInput from "./components/TextCommandInput";
import { CartIcon, SpeakerIcon, SpeakerMuteIcon } from "./components/icons";
import "./App.css";

let toastId = 0;

function App() {
  const { items, history, addItem, removeItem, removeById, updateQuantity, togglePicked } =
    useShoppingList();
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const pushToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const notify = useCallback(
    (message, type, lang) => {
      pushToast(message, type);
      if (speechEnabled) speakText(message, lang);
    },
    [pushToast, speechEnabled]
  );

  const handleCommand = useCallback(
    (transcriptText, lang) => {
      const parsed = parseIntent(transcriptText, lang);

      switch (parsed.intent) {
        case "add": {
          if (!parsed.item) {
            notify("Didn't catch an item name — try again.", "error", lang);
            return;
          }
          addItem(parsed.item, parsed.quantity, parsed.unit);
          notify(
            `Added ${parsed.quantity > 1 ? `${parsed.quantity} ` : ""}${parsed.item}${parsed.unit ? ` (${parsed.unit})` : ""}.`,
            "success",
            lang
          );
          break;
        }
        case "remove": {
          if (!parsed.item) {
            notify("Didn't catch what to remove — try again.", "error", lang);
            return;
          }
          const result = removeItem(parsed.item);
          notify(
            result.ok ? `Removed ${parsed.item}.` : `${parsed.item} wasn't on your list.`,
            result.ok ? "success" : "error",
            lang
          );
          break;
        }
        case "search": {
          const query = parsed.item || "";
          setSearchQuery(query || "all items");
          setSearchResults(searchCatalog({ query, ...parsed.filters }));
          notify(`Searching for “${query || "products"}”…`, "info", lang);
          break;
        }
        case "substitute": {
          const resolved = resolveSubstitutes(parsed);
          notify(resolved.reason, "info", lang);
          break;
        }
        default:
          notify("Sorry, I didn't understand that command.", "error", lang);
      }
    },
    [addItem, removeItem, notify]
  );

  const { isSupported, isListening, transcript, error, language, setLanguage, startListening, stopListening } =
    useVoiceRecognition({ onResult: handleCommand });

  useEffect(() => {
    if (error) {
      pushToast(error.message, "error");
    }
  }, [error, pushToast]);

  // Simulate an async suggestions fetch so the loading state is meaningfully
  // demonstrated, even though the computation itself is local/synchronous.
  useEffect(() => {
    setSuggestionsLoading(true);
    const timer = setTimeout(() => {
      setSuggestions(getAllSuggestions(history, items));
      setSuggestionsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [history, items]);

  const handleToggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleManualSubmit = (text) => {
    handleCommand(text, language);
  };

  const handleQuickAdd = (name) => {
    addItem(name, 1, null);
    notify(`Added ${name}.`, "success", language);
  };

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const pickedItems = useMemo(() => items.filter((i) => i.picked).length, [items]);
  const listTotal = useMemo(() => estimateListTotal(items), [items]);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo">
            <CartIcon />
          </span>
          <h1>Voice Shopping Assistant</h1>
        </div>
        <p className="app__subtitle">
          {totalItems} item{totalItems === 1 ? "" : "s"} on your list
          {pickedItems > 0 && ` · ${pickedItems} picked up`}
        </p>
      </header>

      <main className="app__main">
        <section className="voice-panel">
          <div className="voice-panel__top">
            <MicButton isListening={isListening} isSupported={isSupported} onToggle={handleToggleMic} />
          </div>
          <div className="voice-panel__row">
            <LanguageSelector language={language} onChange={setLanguage} disabled={isListening} />
            <button
              type="button"
              className="speech-toggle"
              aria-pressed={speechEnabled}
              aria-label={speechEnabled ? "Mute voice confirmations" : "Enable voice confirmations"}
              onClick={() => setSpeechEnabled((v) => !v)}
            >
              {speechEnabled ? <SpeakerIcon /> : <SpeakerMuteIcon />}
            </button>
          </div>
          <TranscriptPanel transcript={transcript} isListening={isListening} error={error} />
          <TextCommandInput onSubmit={handleManualSubmit} />
        </section>

        {searchQuery && (
          <SearchResults
            results={searchResults}
            query={searchQuery}
            onAdd={handleQuickAdd}
            onClose={() => setSearchQuery("")}
          />
        )}

        <SuggestionCard suggestions={suggestions} onAdd={handleQuickAdd} isLoading={suggestionsLoading} />

        <section className="list-section">
          <h2>
            <CartIcon /> Your List
          </h2>
          <ListView
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemove={removeById}
            onTogglePicked={togglePicked}
          />
          <ListTotal
            total={listTotal.total}
            pricedCount={listTotal.pricedCount}
            totalCount={listTotal.totalCount}
          />
        </section>
      </main>

      <ToastStack toasts={toasts} />
    </div>
  );
}

export default App;
