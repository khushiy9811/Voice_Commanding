import { useCallback, useEffect, useState } from "react";
import { categorize } from "../lib/categorize";
import { loadList, saveList, loadHistory, saveHistory } from "../lib/storage";

let idCounter = Date.now();
function nextId() {
  idCounter += 1;
  return idCounter;
}

function normalizeName(name) {
  return name.toLowerCase().trim();
}

export function useShoppingList() {
  const [items, setItems] = useState(() => loadList());
  const [history, setHistory] = useState(() => loadHistory());

  useEffect(() => {
    saveList(items);
  }, [items]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addItem = useCallback((rawName, quantity = 1, unit = null) => {
    if (!rawName) return { ok: false, reason: "no-item" };
    const name = normalizeName(rawName);
    const category = categorize(name);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.name === name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          unit: unit || updated[existingIndex].unit,
          picked: false,
        };
        return updated;
      }
      return [
        ...prev,
        { id: nextId(), name, quantity, unit, category, picked: false, addedAt: Date.now() },
      ];
    });

    setHistory((prev) => [...prev, { name, addedAt: Date.now() }]);
    return { ok: true, name, quantity, category };
  }, []);

  const removeItem = useCallback((rawName) => {
    if (!rawName) return { ok: false, reason: "no-item" };
    const name = normalizeName(rawName);
    let removed = false;
    setItems((prev) => {
      const exists = prev.some((i) => i.name === name || i.name.includes(name));
      if (!exists) return prev;
      removed = true;
      return prev.filter((i) => !(i.name === name || i.name.includes(name)));
    });
    return { ok: removed, name };
  }, []);

  const removeById = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
    );
  }, []);

  const togglePicked = useCallback((id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, picked: !i.picked } : i))
    );
  }, []);

  const clearList = useCallback(() => setItems([]), []);

  return {
    items,
    history,
    addItem,
    removeItem,
    removeById,
    updateQuantity,
    togglePicked,
    clearList,
  };
}
