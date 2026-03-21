import { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { BookOpen, Sparkles, Calendar, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeJournalEntry, JournalAnalysis } from "../services/gemini";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  analysis?: JournalAnalysis;
}

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const entriesRef = useRef<JournalEntry[]>([]);
  useEffect(() => { entriesRef.current = entries; }, [entries]);

  useEffect(() => {
    const saved = localStorage.getItem("evata_journal");
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.trim()) {
      toast.error("Please write something before saving");
      return;
    }
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry,
    };
    const updated = [newEntry, ...entriesRef.current];
    setEntries(updated);
    entriesRef.current = updated;
    localStorage.setItem("evata_journal", JSON.stringify(updated));
    setCurrentEntry("");
    toast.success("Journal entry saved!");
  };

  const analyzeEntry = async (entry: JournalEntry) => {
    if (!entry.content.trim()) {
      toast.error("This entry has no content to analyse");
      return;
    }
    setAnalyzingId(entry.id);
    setSelectedEntry({ ...entry, analysis: undefined });

    try {
      const analysis = await analyzeJournalEntry(entry.content);
      const latest = entriesRef.current;
      const updated = latest.map((e) =>
        e.id === entry.id ? { ...e, analysis } : e
      );
      setEntries(updated);
      entriesRef.current = updated;
      setSelectedEntry({ ...entry, analysis });
      localStorage.setItem("evata_journal", JSON.stringify(updated));
      toast.success("Analysis complete!");
    } catch (err: any) {
      console.error("Journal analysis failed:", err?.message || err);
      toast.error(err?.message || "Analysis failed. Please try again.");
      setSelectedEntry(entry);
    } finally {
      setAnalyzingId(null);
    }
  };

  const deleteEntry = (id: string) => {
    const updated = entriesRef.current.filter((e) => e.id !== id);
    setEntries(updated);
    entriesRef.current = updated;
    localStorage.setItem("evata_journal", JSON.stringify(updated));
    if (selectedEntry?.id === id) setSelectedEntry(null);
    toast.success("Entry deleted");
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const scoreLabel = (score: number) => {
    if (score >= 8) return "Doing well";
    if (score >= 5) return "Navigating";
    return "Needs care";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140FF0]/5 to-[#EBF00F]/5">
      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <BookOpen className="text-[#140FF0]" size={40} />
            <h1 className="text-4xl font-bold text-[#140FF0]">AI Journal</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Write freely. Get a real AI-powered psychological read on each entry.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Writing Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[#140FF0] mb-6">New Entry</h2>
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="What's on your mind? Write about your thoughts, feelings, experiences, or reflections..."
              className="min-h-[400px] text-lg mb-4 resize-none"
            />
            <Button
              onClick={saveEntry}
              className="w-full bg-[#140FF0] hover:bg-[#0f0bc0] text-white py-6 text-lg"
            >
              Save Entry
            </Button>
          </div>

          {/* Past Entries */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[#140FF0] mb-6">Past Entries</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No entries yet. Start writing!</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      selectedEntry?.id === entry.id
                        ? "border-[#140FF0] bg-[#140FF0]/5"
                        : "border-gray-200 hover:border-[#140FF0]/50"
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-gray-700 line-clamp-3 mb-3">{entry.content}</p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {entry.analysis && (
                        <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${scoreColor(entry.analysis.emotionalScore)}`}>
                          <Sparkles size={12} />
                          {entry.analysis.emotionalState} · {scoreLabel(entry.analysis.emotionalScore)}
                        </div>
                      )}
                      <Button
                        onClick={(e) => { e.stopPropagation(); analyzeEntry(entry); }}
                        size="sm"
                        disabled={analyzingId === entry.id}
                        className="bg-[#EBF00F] text-[#140FF0] hover:bg-[#d4d60d]"
                      >
                        {analyzingId === entry.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" /> Analysing…
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles size={14} />
                            {entry.analysis ? "Re-analyse" : "Analyse Entry"}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {analyzingId && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#140FF0] border-t-transparent mx-auto mb-4" />
            <p className="text-lg text-gray-600">Reading your entry deeply…</p>
            <p className="text-sm text-gray-400 mt-1">Gemini is thinking about what you wrote</p>
          </div>
        )}

        {/* Analysis Display */}
        {!analyzingId && selectedEntry && selectedEntry.analysis && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-[#EBF00F]" size={32} />
              <h2 className="text-2xl font-bold text-[#140FF0]">AI Analysis</h2>
            </div>

            <div className="bg-gradient-to-r from-[#140FF0]/5 to-[#EBF00F]/5 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Your Entry:</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedEntry.content}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className={`rounded-xl p-5 border-2 text-center ${scoreColor(selectedEntry.analysis.emotionalScore)}`}>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Wellness Score</p>
                <p className="text-4xl font-bold">{selectedEntry.analysis.emotionalScore}/10</p>
                <p className="text-sm font-medium mt-1">{scoreLabel(selectedEntry.analysis.emotionalScore)}</p>
              </div>
              <div className="rounded-xl p-5 border-2 border-[#140FF0]/20 bg-[#140FF0]/5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[#140FF0]/70">Emotional State</p>
                <p className="text-xl font-bold text-[#140FF0]">{selectedEntry.analysis.emotionalState}</p>
              </div>
              <div className="rounded-xl p-5 border-2 border-[#EBF00F] bg-[#EBF00F]/10 text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Core Theme</p>
                <p className="text-lg font-bold text-gray-800">{selectedEntry.analysis.theme}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#140FF0] to-[#140FF0]/80 rounded-xl p-6 mb-8 text-white text-center">
              <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">A Message For You</p>
              <p className="text-xl font-semibold leading-relaxed italic">"{selectedEntry.analysis.affirmation}"</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-[#140FF0] mb-4 flex items-center gap-2">
                  <Sparkles size={18} /> Key Insights
                </h3>
                <div className="space-y-3">
                  {selectedEntry.analysis.insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <span className="text-[#140FF0] font-bold text-lg leading-none mt-0.5">•</span>
                      <p className="text-gray-700 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#140FF0] mb-4 flex items-center gap-2">
                  💡 Recommendations
                </h3>
                <div className="space-y-3">
                  {selectedEntry.analysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-[#EBF00F]/10 border border-[#EBF00F] rounded-xl">
                      <span className="text-[#140FF0] font-bold text-lg leading-none mt-0.5">→</span>
                      <p className="text-gray-700 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => analyzeEntry(selectedEntry)}
                disabled={!!analyzingId}
                variant="outline"
                className="border-[#140FF0] text-[#140FF0] hover:bg-[#140FF0] hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} /> Re-analyse Entry
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}