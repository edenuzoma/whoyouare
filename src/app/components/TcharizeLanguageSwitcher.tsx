import { Languages, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";

type LanguageCode = "en" | "ha" | "ig" | "yo" | "pcm";

const languageOptions: Array<{ code: LanguageCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "ha", label: "Hausa" },
  { code: "ig", label: "Igbo" },
  { code: "yo", label: "Yorùbá" },
  { code: "pcm", label: "Naijá" },
];

const blockedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "SVG", "CANVAS"]);

export function TcharizeLanguageSwitcher() {
  const originals = useRef(new Map<Text, string>());
  const cache = useRef(new Map<string, string>());
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function restoreEnglish() {
    for (const [node, text] of originals.current) {
      if (node.isConnected) node.textContent = text;
    }
    originals.current.clear();
  }

  async function changeLanguage(targetLanguage: LanguageCode) {
    const previousLanguage = language;
    restoreEnglish();
    setLanguage(targetLanguage);
    setMessage("");
    if (targetLanguage === "en") return;

    setBusy(true);
    try {
      const groups = groupTextNodes(collectTextNodes());
      const missingTexts = [...groups.keys()].filter((text) => !cache.current.has(`${targetLanguage}:${text}`));

      for (let index = 0; index < missingTexts.length; index += 100) {
        const texts = missingTexts.slice(index, index + 100);
        const response = await fetch("/api/tcharize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts, targetLanguage, mode: "fast" }),
        });
        const result = await response.json().catch(() => ({})) as { translations?: string[]; message?: string };
        if (!response.ok || !Array.isArray(result.translations) || result.translations.length !== texts.length) {
          throw new Error(result.message || "Translation did not finish.");
        }
        texts.forEach((text, itemIndex) => {
          const translation = result.translations?.[itemIndex];
          if (translation) cache.current.set(`${targetLanguage}:${text}`, translation);
        });
      }

      for (const [text, nodes] of groups) {
        const translation = cache.current.get(`${targetLanguage}:${text}`);
        if (!translation) continue;
        for (const node of nodes) {
          const original = node.textContent ?? "";
          originals.current.set(node, original);
          node.textContent = original.replace(text, translation);
        }
      }
      setMessage(`This page is now in ${languageOptions.find((item) => item.code === targetLanguage)?.label}.`);
    } catch (error) {
      restoreEnglish();
      setLanguage(previousLanguage);
      setMessage(error instanceof Error ? error.message : "Translation did not finish.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div data-tcharize-ignore className="fixed right-3 top-20 z-[70] rounded-2xl border border-[#140FF0]/20 bg-white/95 p-2 shadow-lg backdrop-blur md:right-5 md:top-24">
      <label htmlFor="tcharize-language" className="sr-only">Change website language</label>
      <div className="flex items-center gap-2">
        {busy ? <LoaderCircle className="size-4 animate-spin text-[#140FF0] motion-reduce:animate-none" aria-hidden="true" /> : <Languages className="size-4 text-[#140FF0]" aria-hidden="true" />}
        <select
          id="tcharize-language"
          value={language}
          disabled={busy}
          onChange={(event) => void changeLanguage(event.target.value as LanguageCode)}
          className="min-h-10 rounded-xl border-0 bg-transparent px-2 text-sm font-semibold text-[#140FF0] outline-none focus:ring-2 focus:ring-[#140FF0] disabled:cursor-wait"
        >
          {languageOptions.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
        </select>
      </div>
      <p className="sr-only" aria-live="polite">{message}</p>
    </div>
  );
}

function groupTextNodes(nodes: Text[]) {
  const groups = new Map<string, Text[]>();
  for (const node of nodes) {
    const text = node.textContent?.trim() ?? "";
    groups.set(text, [...(groups.get(text) ?? []), node]);
  }
  return groups;
}

function collectTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || blockedTags.has(parent.tagName) || parent.isContentEditable || parent.closest("[data-tcharize-ignore]")) {
        return NodeFilter.FILTER_REJECT;
      }
      const text = node.textContent?.trim() ?? "";
      if (text.length < 2 || text.length > 500 || /^[\d\s.,\-+%$€£¥()[\]{}|/\\#@!?:;]+$/.test(text) || /^https?:\/\//i.test(text)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}
