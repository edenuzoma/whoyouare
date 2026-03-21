import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { GeminiAnalysis } from "../services/gemini";

interface ShareCardsProps {
  profileData: GeminiAnalysis;
}

export function ShareCards({ profileData }: ShareCardsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { firstName, archetype, traits, superPowers } = profileData;
  const siteUrl = window.location.origin;
  const personalUrl = window.location.href;

  // Pull real data from the AI analysis
  const topTrait = traits?.[0];
  const secondTrait = traits?.[1];
  const power1 = superPowers?.[0];
  const power2 = superPowers?.[1];
  const power3 = superPowers?.[2];
  const power4 = superPowers?.[3];

  const shareCards = [
    {
      title: "MY ARCHETYPE",
      content: `WhoYouAre just called me "${archetype}" 🎯\n\nThat one hit different.\n\nDiscover your own archetype — it's free:\n${siteUrl}`,
      platform: "twitter",
    },
    {
      title: "SHARE THE TOOL",
      content: `This WhoYouAre analysis was surprisingly deep.\n\nIt read me like a book — and explained it in the simplest way.\n\nGet your own free read:\n${siteUrl}`,
      platform: "general",
    },
    {
      title: `MY TOP TRAIT`,
      content: topTrait
        ? `WhoYouAre analysed my profile and said:\n\n"${topTrait.headline}"\n\nMy ${topTrait.title} score: ${topTrait.score}%\n\n${topTrait.detail}\n\nFind out yours: ${siteUrl}`
        : `WhoYouAre analysed my profile and the insights were wild.\n\nFind out yours: ${siteUrl}`,
      platform: "twitter",
    },
    {
      title: "SECOND INSIGHT",
      content: secondTrait
        ? `Another thing WhoYouAre spotted about me:\n\n"${secondTrait.headline}"\n\n${secondTrait.detail}\n\nGet your own read: ${siteUrl}`
        : `WhoYouAre gave me insights I wasn't expecting.\n\nGet yours: ${siteUrl}`,
      platform: "twitter",
    },
    {
      title: "MY SUPER POWERS",
      content: `According to WhoYouAre, my super powers are:\n\n${power1 ? `${power1.emoji} ${power1.title}` : ""}\n${power2 ? `${power2.emoji} ${power2.title}` : ""}\n${power3 ? `${power3.emoji} ${power3.title}` : ""}\n${power4 ? `${power4.emoji} ${power4.title}` : ""}\n\nWhat are yours? Find out free:\n${siteUrl}`,
      platform: "linkedin",
    },
    {
      title: "SHARE YOUR FULL READ",
      content: `I just got my WhoYouAre deep read and it was honestly eye-opening.\n\nRead my full analysis here:\n${personalUrl}\n\nGet your own at: ${siteUrl}`,
      platform: "general",
    },
  ];

  const handleCopy = (content: string, index: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      textArea.remove();
      setCopiedIndex(index);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      textArea.remove();
      toast.error("Failed to copy. Please try again.");
    }
  };

  const handleShare = (content: string, platform: string) => {
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(personalUrl)}`;
    } else {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shareCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#140FF0] transition-all"
        >
          <div className="mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              {card.title}
            </span>
          </div>

          <div className="mb-6 text-gray-700 text-sm leading-relaxed whitespace-pre-line min-h-[180px]">
            {card.content}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleCopy(card.content, index)}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <Copy size={16} className="mr-2" />
              {copiedIndex === index ? "Copied!" : "Copy"}
            </Button>

            {card.platform === "twitter" && (
              <Button
                onClick={() => handleShare(card.content, "twitter")}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
              >
                <Twitter size={16} className="mr-2" />
                Share
              </Button>
            )}

            {card.platform === "linkedin" && (
              <Button
                onClick={() => handleShare(card.content, "linkedin")}
                className="bg-[#0A66C2] hover:bg-[#004182] text-white"
              >
                <Linkedin size={16} className="mr-2" />
                Share
              </Button>
            )}

            {card.platform === "general" && (
              <Button
                onClick={() => handleShare(card.content, "twitter")}
                className="bg-[#140FF0] hover:bg-[#0f0bc0] text-white"
              >
                <Twitter size={16} className="mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}