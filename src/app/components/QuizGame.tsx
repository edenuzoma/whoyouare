import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Trophy, RotateCcw, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { GeminiAnalysis } from "../services/gemini";

interface QuizGameProps {
  profileData: GeminiAnalysis;
  onClose: () => void;
}

export function QuizGame({ profileData, onClose }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);

  const { firstName, archetype, traits, superPowers, thingsToTry } = profileData;

  const generateQuestions = () => {
    const q: any[] = [];

    // Q1 — archetype
    q.push({
      question: `WhoYouAre gave you a unique archetype. Which one is yours?`,
      options: shuffle([
        archetype,
        "The Safe Player",
        "The Loud Voice",
        "The Slow Starter",
      ]),
      correct: archetype,
    });

    // Q2 — trait 1 title
    if (traits?.[0]) {
      q.push({
        question: `What did WhoYouAre identify as your first key trait?`,
        options: shuffle([
          traits[0].title,
          "How You Manage Money",
          "How You Handle Criticism",
          "How You Play Sports",
        ]),
        correct: traits[0].title,
      });
    }

    // Q3 — trait 1 score
    if (traits?.[0]) {
      const real = traits[0].score;
      q.push({
        question: `What score did WhoYouAre give for "${traits[0].title}"?`,
        options: shuffle([
          `${real}%`,
          `${clamp(real - 10)}%`,
          `${clamp(real + 8)}%`,
          `${clamp(real - 20)}%`,
        ]),
        correct: `${real}%`,
      });
    }

    // Q4 — trait 1 headline
    if (traits?.[0]) {
      q.push({
        question: `Which headline best describes your "${traits[0].title}"?`,
        options: shuffle([
          traits[0].headline,
          "You blend into any crowd.",
          "You avoid challenges at all costs.",
          "You talk a lot but say little.",
        ]),
        correct: traits[0].headline,
      });
    }

    // Q5 — trait 2 title
    if (traits?.[1]) {
      q.push({
        question: `What was your second trait identified by WhoYouAre?`,
        options: shuffle([
          traits[1].title,
          "How You Cook Meals",
          "How You Spend Weekends",
          "How You Avoid Conflicts",
        ]),
        correct: traits[1].title,
      });
    }

    // Q6 — superpower 1
    if (superPowers?.[0]) {
      q.push({
        question: `Which of these is one of your super powers according to WhoYouAre?`,
        options: shuffle([
          superPowers[0].title,
          "Speed Reading Champion",
          "Perfect Memory Machine",
          "Master of Disguise",
        ]),
        correct: superPowers[0].title,
      });
    }

    // Q7 — superpower 2
    if (superPowers?.[1]) {
      q.push({
        question: `WhoYouAre identified another super power in you. Which one?`,
        options: shuffle([
          superPowers[1].title,
          "Extreme Multitasker",
          "Sleep Champion",
          "Natural Born Actor",
        ]),
        correct: superPowers[1].title,
      });
    }

    // Q8 — thing to try title
    if (thingsToTry?.[0]) {
      q.push({
        question: `What did WhoYouAre suggest you try more of?`,
        options: shuffle([
          thingsToTry[0].title,
          "Learn to skateboard",
          "Start collecting stamps",
          "Watch more TV",
        ]),
        correct: thingsToTry[0].title,
      });
    }

    // Q9 — trait 3 score
    if (traits?.[2]) {
      const real = traits[2].score;
      q.push({
        question: `What score did WhoYouAre give for "${traits[2].title}"?`,
        options: shuffle([
          `${real}%`,
          `${clamp(real - 15)}%`,
          `${clamp(real + 10)}%`,
          `${clamp(real - 5)}%`,
        ]),
        correct: `${real}%`,
      });
    }

    // Q10 — trait 4 headline
    if (traits?.[3]) {
      q.push({
        question: `How did WhoYouAre describe "${traits[3].title}"?`,
        options: shuffle([
          traits[3].headline,
          "You give up too easily.",
          "You never start anything.",
          "You coast through life.",
        ]),
        correct: traits[3].headline,
      });
    }

    // Shuffle all and pick 8
    return shuffle(q).slice(0, 8).map((q: any) => {
      const correctIndex = q.options.indexOf(q.correct);
      return { ...q, correctIndex };
    });
  };

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function clamp(n: number): number {
    return Math.max(10, Math.min(99, n));
  }

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    if (questions[currentQuestion].correctIndex === answerIndex) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    if (attempts < 2) {
      setCurrentQuestion(0);
      setScore(0);
      setAnswers([]);
      setShowResults(false);
      setAttempts(attempts + 1);
      setQuestions(generateQuestions());
    }
  };

  const handleShareScore = async () => {
    const shareText = `I scored ${score}/${questions.length} on the WhoYouAre self-knowledge quiz!\n\nDo you know yourself as well as AI does? Try it: ${window.location.origin}`;
    if (navigator.share) {
      try { await navigator.share({ title: "My WhoYouAre Quiz Score", text: shareText }); toast.success("Shared!"); } catch {}
    } else {
      const ta = document.createElement("textarea");
      ta.value = shareText;
      ta.style.position = "fixed";
      ta.style.left = "-999999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); toast.success("Score copied to clipboard!"); } catch { toast.error("Failed to copy."); }
      ta.remove();
    }
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-xl text-gray-600">Loading your quiz…</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = score >= 5;
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${passed ? "bg-green-100" : "bg-orange-100"}`}>
            <Trophy className={passed ? "text-green-600" : "text-orange-600"} size={48} />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-[#140FF0]">Quiz Complete!</h2>
          <div className="text-6xl font-bold mb-4 text-[#140FF0]">{score}/{questions.length}</div>
          <div className="text-2xl font-semibold mb-6">{percentage}% Correct</div>
          {passed ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <p className="text-lg text-green-800 font-medium">🎉 Impressive, {firstName}! You know yourself better than WhoYouAre!</p>
              <p className="text-green-700 mt-2">Your self-awareness is genuinely rare. Share it!</p>
            </div>
          ) : (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
              <p className="text-lg text-orange-800 font-medium">WhoYouAre knows you better than you know yourself, {firstName}!</p>
              <p className="text-orange-700 mt-2">
                {attempts < 2 ? "You can try again — you might surprise yourself." : "Keep exploring your profile to learn more!"}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!passed && attempts < 2 && (
              <Button onClick={handleRetry} className="bg-[#140FF0] hover:bg-[#0f0bc0] text-white px-6 py-6 text-lg rounded-full inline-flex items-center gap-2">
                <RotateCcw size={20} /> Try Again ({2 - attempts} left)
              </Button>
            )}
            {(passed || attempts >= 2) && (
              <Button onClick={handleShareScore} className="bg-[#EBF00F] text-[#140FF0] hover:bg-[#d4d60d] px-6 py-6 text-lg rounded-full inline-flex items-center gap-2">
                <Share2 size={20} /> Share Score
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="border-2 border-[#140FF0] text-[#140FF0] hover:bg-[#140FF0] hover:text-white px-6 py-6 text-lg rounded-full inline-flex items-center gap-2">
              <ArrowLeft size={20} /> Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-[#140FF0]">Score: {score}/{currentQuestion}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#140FF0] h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-8 text-[#140FF0]">{questions[currentQuestion].question}</h3>
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-6 rounded-xl border-2 border-gray-200 hover:border-[#140FF0] hover:bg-[#140FF0]/5 transition-all duration-200 font-medium text-lg"
            >
              {option}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-8 text-gray-500 hover:text-[#140FF0] transition-colors">
          ← Back to profile
        </button>
      </div>
    </div>
  );
}