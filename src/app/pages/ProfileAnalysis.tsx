import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Heart, Zap, Award, Mail, Linkedin, Twitter, Copy, Check, Share2 } from "lucide-react";
import { QuizGame } from "../components/QuizGame";
import { ShareCards } from "../components/ShareCards";
import { toast } from "sonner";
import { analyzeProfile, GeminiAnalysis } from "../services/gemini";

export function ProfileAnalysis() {
  const { name } = useParams<{ name: string }>();
  const [showQuiz, setShowQuiz] = useState(false);
  const [profileData, setProfileData] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedPersonal, setCopiedPersonal] = useState(false);

  const socialUrl = localStorage.getItem("evata_social_url") || "";
  const socialType = localStorage.getItem("evata_social_type") || "linkedin";

  useEffect(() => {
    // Re-run whenever the profile URL or name changes
    setLoading(true);
    setProfileData(null);

    analyzeProfile(socialUrl, socialType)
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile analysis error:", err);
        setLoading(false);
      });
  }, [socialUrl, name]); // re-fetches when URL or name changes

  const copyToClipboard = (text: string, type: "general" | "personal") => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-999999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      if (type === "general") {
        setCopiedGeneral(true);
        setTimeout(() => setCopiedGeneral(false), 2000);
      } else {
        setCopiedPersonal(true);
        setTimeout(() => setCopiedPersonal(false), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy.");
    }
    document.body.removeChild(ta);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out my WhoYouAre profile analysis! Discover insights about your digital personality.`;
    if (navigator.share) {
      try { await navigator.share({ title: "My WhoYouAre Profile Analysis", text, url }); } catch {}
    } else {
      copyToClipboard(`${text} ${url}`, "general");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#140FF0]/5 to-[#EBF00F]/5 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#140FF0]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#140FF0] animate-spin" />
          </div>
          <p className="text-xl font-semibold text-[#140FF0] mb-2">Analysing your profile…</p>
          <p className="text-gray-500 text-sm">This takes about 10–15 seconds</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  /* ── Quiz mode ── */
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#140FF0]/5 to-[#EBF00F]/5">
        <Navbar />
        <QuizGame profileData={profileData} onClose={() => setShowQuiz(false)} />
      </div>
    );
  }

  /* ── Render deep read paragraphs ── */
  const renderDeepRead = (text: string) =>
    text.split(/\n+/).filter(Boolean).map((para, i) => {
      const parts = para.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={i} className="text-gray-800 text-lg leading-relaxed mb-5">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900">{part}</strong> : part
          )}
        </p>
      );
    });

  const generalLink = `${window.location.origin}`;
  const personalLink = window.location.href;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ══ SECTION 1 — HEADER ══ */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-2">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Know and Grow You</p>
            <p className="text-sm text-gray-500">
              by <span className="font-semibold text-gray-700">WhoYouAre, the Behavioral Science Lab</span>
            </p>
          </div>
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:border-[#140FF0] hover:text-[#140FF0] text-sm rounded-full px-5"
          >
            <Share2 size={14} className="mr-2" /> Share
          </Button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          {profileData.firstName},
        </h1>

        <div className="inline-flex items-center gap-2 bg-[#140FF0]/8 border border-[#140FF0]/20 rounded-full px-4 py-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#140FF0]">Your Archetype</span>
          <span className="text-sm font-semibold text-gray-800">{profileData.archetype}</span>
        </div>

        <div className="mb-12">
          {renderDeepRead(profileData.deepRead)}
        </div>
      </div>

      {/* ══ SECTION 2 — TRAIT SCORES ══ */}
      <div className="bg-gray-50 border-t border-b border-gray-100 py-12 mb-12">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Behavioral Traits</p>
          <div className="space-y-8">
            {profileData.traits.map((trait, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{trait.title}</span>
                  <span className="text-sm font-bold text-[#140FF0]">{trait.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-[#140FF0] to-[#EBF00F] h-2 rounded-full transition-all duration-700"
                    style={{ width: `${trait.score}%` }}
                  />
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">{trait.headline}</p>
                <p className="text-gray-600 leading-relaxed">{trait.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 3 — SHARE LINKS ══ */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blow a friend's mind.</h2>
          <p className="text-gray-600 mb-5">
            <strong>Someone you know might need to read their own deep read.</strong> It might just unstuck them or teach them something about themselves.
            <br />Send them the tool and they'll get their own read in seconds.
          </p>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 mb-3">
            <span className="text-gray-700 text-sm flex-1 font-mono truncate">{generalLink}</span>
            <button
              onClick={() => copyToClipboard(generalLink, "general")}
              className="flex items-center gap-1 text-sm font-semibold text-[#140FF0] hover:text-[#0f0bc0] transition-colors"
            >
              {copiedGeneral ? <Check size={15} /> : <Copy size={15} />}
              {copiedGeneral ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            <strong>Don't worry:</strong> This is just a generic link to the tool. It does <em>not</em> contain your deep read.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-10 mb-10">
          <p className="text-gray-700 mb-4">
            Or… <strong>Want to share your read with someone?</strong> <em>Use this link:</em>
          </p>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 mb-3">
            <span className="text-gray-700 text-sm flex-1 font-mono truncate">{personalLink}</span>
            <button
              onClick={() => copyToClipboard(personalLink, "personal")}
              className="flex items-center gap-1 text-sm font-semibold text-[#140FF0] hover:text-[#0f0bc0] transition-colors"
            >
              {copiedPersonal ? <Check size={15} /> : <Copy size={15} />}
              {copiedPersonal ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            <strong>Heads up:</strong> This link contains your deep read. Only share with people you're comfortable sharing it with.
          </p>
        </div>
      </div>

      {/* ══ ORIGINAL DESIGN FROM HERE ══ */}
      <div className="max-w-4xl mx-auto px-4 pb-20">

        {/* Super Powers */}
        <div className="bg-gradient-to-r from-[#140FF0] to-[#140FF0]/80 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Award size={36} /> Your Super Powers!
          </h2>
          <p className="text-lg mb-6 opacity-90">These are things you're really good at:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {profileData.superPowers.map((power, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl mb-2">{power.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{power.title}</h3>
                <p className="opacity-90">{power.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Things to Try */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#140FF0] mb-2 flex items-center gap-3">
            <Zap size={36} /> Things You Can Try!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            You're already great! Here are some fun things to try to become even more awesome:
          </p>
          <div className="space-y-6">
            {profileData.thingsToTry.map((item, index) => (
              <div key={index} className="border-2 border-[#EBF00F] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#140FF0] mb-2">{item.title}</h3>
                    <p className="text-gray-700 mb-3">{item.description}</p>
                    <div className="bg-[#EBF00F]/20 rounded-lg p-3">
                      <span className="text-sm font-semibold text-[#140FF0]">💡 Quick Tip: </span>
                      <span className="text-sm text-gray-700">{item.tip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Topics */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#140FF0] mb-2 flex items-center gap-3">
            <Heart size={36} /> Fun Topics to Explore!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Based on what I learned about you, you might enjoy learning about these topics:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {profileData.funTopics.map((topic, index) => (
              <div key={index} className={`${topic.color} rounded-xl p-4 font-medium flex items-center gap-3`}>
                <span className="text-2xl">{topic.emoji}</span>
                <span>{topic.topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz CTA */}
        <div className="bg-gradient-to-r from-[#EBF00F] to-[#EBF00F]/80 rounded-2xl shadow-xl p-8 mb-8 text-[#140FF0] text-center">
          <h2 className="text-3xl font-bold mb-4">🎮 Ready for a Fun Challenge?</h2>
          <p className="text-lg mb-6">
            I learned a lot about you! But do YOU know yourself as well as I do? Let's play a game to find out!
          </p>
          <Button
            onClick={() => setShowQuiz(true)}
            className="bg-[#140FF0] text-white hover:bg-[#0f0bc0] px-8 py-6 text-lg font-bold rounded-full"
          >
            Play Game
          </Button>
        </div>

        {/* Share Cards */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#140FF0] mb-2 text-center">Share Your Results</h2>
          <p className="text-gray-600 text-lg mb-8 text-center">
            Choose a card to share on social media or copy to your clipboard
          </p>
          <ShareCards profileData={profileData} />
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-[#f5f3ed] to-[#e8e6e0] rounded-2xl shadow-xl p-12 text-center">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            WhoYouAre is a psychological behavioral platform. We combine AI-powered analysis
            with psychological insights to help people understand themselves and the people around them.
          </p>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            This is a work of love from a tiny team who's stayed up too late for months on end.
            The hope is it gives you an insight that you can use in life. Let us know if it has!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.location.href = "mailto:edenuzoma22@gmail.com"}
              variant="outline"
              className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-6 text-lg rounded-full inline-flex items-center gap-2"
            >
              <Mail size={20} /> Email Eden
            </Button>
            <Button
              onClick={() => window.open("https://www.linkedin.com/in/edenuzoma", "_blank")}
              variant="outline"
              className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-6 text-lg rounded-full inline-flex items-center gap-2"
            >
              <Linkedin size={20} /> Say hi on LinkedIn
            </Button>
            <Button
              onClick={() => window.open("https://x.com/uzomeden", "_blank")}
              variant="outline"
              className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-6 text-lg rounded-full inline-flex items-center gap-2"
            >
              <Twitter size={20} /> Say hi on Twitter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
