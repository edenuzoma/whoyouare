import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Target, BookOpen, Sparkles } from "lucide-react";
import { LandingNavbar } from "../components/LandingNavbar";
import { Footer } from "../components/Footer";
import { toast } from "sonner";

// Normalise URL — adds https:// if missing and lowercases the domain
function normaliseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  // Lowercase only the domain part, preserve the username/path casing
  return withProtocol.replace(/^(https?:\/\/[^/]+)/i, (match) => match.toLowerCase());
}

// Case-insensitive validation — accepts LinkedIn.com, LINKEDIN.COM, linkedin.com etc.
function isValidLinkedIn(url: string): boolean {
  return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?$/i.test(url.trim());
}

function isValidX(url: string): boolean {
  return /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[a-zA-Z0-9_]+\/?$/i.test(url.trim());
}

function extractFirstName(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const slug = parts[parts.length - 1] || "user";
    return slug.split("-")[0].split("_")[0].toLowerCase() || "user";
  } catch {
    return "user";
  }
}

export function LandingPage() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    const rawLinkedin = linkedinUrl.trim();
    const rawX = xUrl.trim();

    if (!rawLinkedin && !rawX) {
      toast.error("Please enter a LinkedIn or X profile URL to continue");
      return;
    }

    if (rawLinkedin) {
      const normalised = normaliseUrl(rawLinkedin);
      if (!isValidLinkedIn(normalised)) {
        toast.error("Please enter a valid LinkedIn profile URL e.g. linkedin.com/in/yourname");
        return;
      }
      localStorage.setItem("evata_social_url", normalised);
      localStorage.setItem("evata_social_type", "linkedin");
      const firstName = extractFirstName(normalised);
      navigate(`/verify/${firstName}`);
      return;
    }

    if (rawX) {
      const normalised = normaliseUrl(rawX);
      if (!isValidX(normalised)) {
        toast.error("Please enter a valid X profile URL e.g. x.com/yourhandle");
        return;
      }
      localStorage.setItem("evata_social_url", normalised);
      localStorage.setItem("evata_social_type", "x");
      const firstName = extractFirstName(normalised);
      navigate(`/verify/${firstName}`);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#EBF00F]/10 to-[#140FF0]/10">
      <LandingNavbar />

      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#140FF0] to-[#EBF00F] bg-clip-text text-transparent">
            Discover Who You Really Are
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Unlock deep insights about your online persona. Analyze your LinkedIn or X profile
            to understand your behavioral patterns, communication style, and growth opportunities.
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-[#140FF0]">
              Start Your Psychological Journey
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-left text-sm font-medium mb-2 text-gray-700">
                  LinkedIn Profile URL
                </label>
                <Input
                  type="text"
                  placeholder="linkedin.com/in/yourprofile or https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => { setLinkedinUrl(e.target.value); setXUrl(""); }}
                  className="text-lg p-6"
                />
              </div>

              <div className="text-center text-gray-500 font-medium">OR</div>

              <div>
                <label className="block text-left text-sm font-medium mb-2 text-gray-700">
                  X (Twitter) Profile URL
                </label>
                <Input
                  type="text"
                  placeholder="x.com/yourhandle or https://x.com/yourhandle"
                  value={xUrl}
                  onChange={(e) => { setXUrl(e.target.value); setLinkedinUrl(""); }}
                  className="text-lg p-6"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full md:w-auto px-12 py-6 text-lg bg-[#140FF0] hover:bg-[#0f0bc0] text-white rounded-full"
              size="lg"
            >
              Generate Analysis
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="bg-[#140FF0] w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Target className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#140FF0]">Profile Analysis</h3>
            <p className="text-gray-600">
              Get deep psychological insights about your online presence, communication patterns, and professional brand.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="bg-[#140FF0] w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#140FF0]">AI Journal</h3>
            <p className="text-gray-600">
              Document your thoughts and receive AI-powered psychological analysis of your mental patterns and emotions.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="bg-[#140FF0] w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#140FF0]">Medipath</h3>
            <p className="text-gray-600">
              Guided meditation paths with AI-powered relaxation techniques tailored to your psychological profile.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-[#140FF0]">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Enter your profile URL", "Verify your email", "Get detailed analysis", "Share & explore more"].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-[#EBF00F] text-[#140FF0] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}