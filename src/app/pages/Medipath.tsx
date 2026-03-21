import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Play, Pause, RotateCcw, CheckCircle, Home, Star } from "lucide-react";

interface MeditationPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  youtubeId: string;
  steps: string[];
  benefits: string[];
}

export function Medipath() {
  const [selectedPath, setSelectedPath] = useState<MeditationPath | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [pathCompleted, setPathCompleted] = useState(false);

  const meditationPaths: MeditationPath[] = [
    {
      id: "stress-relief",
      title: "Stress Relief & Calm",
      description: "Release tension and find inner peace through guided breathing and visualization",
      duration: "15 minutes",
      youtubeId: "1ZYbU82GVz4",
      steps: [
        "Find a comfortable seated position with your spine straight and shoulders relaxed",
        "Close your eyes gently and take three deep breaths, inhaling through your nose and exhaling through your mouth",
        "Begin to notice the natural rhythm of your breath without trying to change it",
        "As you breathe in, imagine breathing in calm blue light that fills your entire body",
        "As you breathe out, imagine releasing any tension or stress as dark smoke leaving your body",
        "Continue this visualization for 5 minutes, allowing yourself to sink deeper into relaxation",
        "Slowly bring your awareness back to your surroundings, wiggle your fingers and toes",
        "When you're ready, open your eyes and take a moment to notice how you feel",
      ],
      benefits: ["Reduces cortisol levels", "Improves emotional regulation", "Enhances mental clarity", "Promotes better sleep"],
    },
    {
      id: "focus-clarity",
      title: "Focus & Mental Clarity",
      description: "Sharpen your mind and enhance concentration through mindfulness techniques",
      duration: "10 minutes",
      youtubeId: "inpok4MKVLM",
      steps: [
        "Sit in a quiet space where you won't be disturbed",
        "Set an intention to cultivate focus and mental clarity",
        "Focus your attention on a single point — your breath, a candle flame, or a word",
        "When your mind wanders (which it will), gently guide it back to your focal point",
        "Observe your thoughts without judgment, like clouds passing in the sky",
        "Continue this practice for 7 minutes, building your concentration muscle",
        "Gradually expand your awareness to include your entire body and surroundings",
        "Take three deep breaths and slowly return to your day with renewed clarity",
      ],
      benefits: ["Improves concentration", "Enhances decision-making", "Boosts productivity", "Reduces mental fog"],
    },
    {
      id: "emotional-balance",
      title: "Emotional Balance",
      description: "Cultivate emotional resilience and inner harmony",
      duration: "20 minutes",
      youtubeId: "z6X5oEIg6Ak",
      steps: [
        "Lie down in a comfortable position or sit with back support",
        "Place one hand on your heart and one on your belly",
        "Take slow, deep breaths, feeling your belly rise and fall",
        "Scan your body from head to toe, noticing any areas of tension or emotion",
        "Breathe into any uncomfortable sensations with compassion and acceptance",
        "Repeat silently: 'I acknowledge my feelings without judgment'",
        "Visualize your emotions as waves — they rise, peak, and naturally subside",
        "Cultivate gratitude for three things in your life, no matter how small",
        "Rest in this space of emotional balance for a few more breaths",
        "Slowly return to the present moment, carrying this balance with you",
      ],
      benefits: ["Develops emotional intelligence", "Reduces anxiety and depression", "Improves relationship quality", "Builds resilience"],
    },
    {
      id: "energy-boost",
      title: "Energy & Vitality",
      description: "Revitalize your body and mind with energizing breathwork",
      duration: "8 minutes",
      youtubeId: "EwQkfoKxRvo",
      steps: [
        "Stand with feet hip-width apart or sit up tall in a chair",
        "Stretch your arms overhead and take a big, energizing breath",
        "Begin alternate nostril breathing: close right nostril, inhale left; close left, exhale right",
        "Continue for 2 minutes, switching nostrils with each breath",
        "Return to normal breathing and shake out your whole body",
        "Do 10 jumping jacks or march in place to get your blood flowing",
        "Take three powerful breaths, filling your lungs completely",
        "Smile and set an intention for your energized day ahead",
      ],
      benefits: ["Increases energy levels", "Improves circulation", "Enhances mood", "Boosts motivation"],
    },
    {
      id: "sleep-preparation",
      title: "Sleep Preparation",
      description: "Prepare your mind and body for deep, restorative sleep",
      duration: "12 minutes",
      youtubeId: "aEqlQvczMJQ",
      steps: [
        "Lie down in bed in your preferred sleeping position",
        "Progressive muscle relaxation: tense and release each muscle group from toes to head",
        "Soften your jaw, relax your tongue, and let your eyes rest gently closed",
        "Breathe slowly, counting '4' on the inhale, '7' on the hold, '8' on the exhale",
        "Imagine each exhale releasing the day's worries and tensions",
        "Visualize a peaceful scene: a quiet beach, a forest, or a cozy cabin",
        "Allow yourself to drift deeper into relaxation with each breath",
        "Let go of any effort to stay awake or fall asleep — simply be",
        "Trust your body's natural wisdom to guide you into restful sleep",
      ],
      benefits: ["Improves sleep quality", "Reduces insomnia", "Calms racing thoughts", "Promotes deep rest"],
    },
  ];

  const handleStepComplete = () => {
    const totalSteps = selectedPath?.steps.length || 0;
    const isLastStep = currentStep === totalSteps - 1;

    if (isLastStep) {
      // Mark all steps including current as complete and show completion screen
      const allSteps = Array.from({ length: totalSteps }, (_, i) => i);
      setCompletedSteps(allSteps);
      setPathCompleted(true);
    } else {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const resetPath = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(false);
    setPathCompleted(false);
  };

  const goHome = () => {
    setSelectedPath(null);
    resetPath();
  };

  // ── Completion Screen ──────────────────────────────────────────────────────
  if (pathCompleted && selectedPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#140FF0]/5 to-[#EBF00F]/5">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center">
            {/* Celebration */}
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-[#140FF0] mb-3">
              Path Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              You just finished
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-8">
              {selectedPath.title}
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={32} className="text-[#EBF00F] fill-[#EBF00F]" />
              ))}
            </div>

            {/* Completion message */}
            <div className="bg-gradient-to-r from-[#140FF0]/10 to-[#EBF00F]/10 rounded-xl p-6 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                You completed all <strong>{selectedPath.steps.length} steps</strong> of this meditation path.
                Take a moment to notice how you feel right now compared to when you started.
                That shift — however small — is real progress.
              </p>
            </div>

            {/* Benefits achieved */}
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">What you just gave yourself</p>
              <div className="grid grid-cols-2 gap-3">
                {selectedPath.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-800 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={resetPath}
                className="flex-1 bg-[#EBF00F] text-[#140FF0] hover:bg-[#d4d60d] py-6 text-lg font-bold"
              >
                <RotateCcw size={20} className="mr-2" />
                Do It Again
              </Button>
              <Button
                onClick={goHome}
                className="flex-1 bg-[#140FF0] text-white hover:bg-[#0f0bc0] py-6 text-lg font-bold"
              >
                <Home size={20} className="mr-2" />
                Back to Paths
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140FF0]/5 to-[#EBF00F]/5">
      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#140FF0] mb-4">
            Medipath — Your Meditation Journey
          </h1>
          <p className="text-gray-600 text-lg">
            AI-guided meditation paths tailored to your needs
          </p>
        </div>

        {!selectedPath ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationPaths.map((path) => (
              <div
                key={path.id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => { setSelectedPath(path); resetPath(); }}
              >
                <div className="bg-[#140FF0] text-white px-3 py-1 rounded-full text-sm inline-block mb-4">
                  {path.duration}
                </div>
                <h3 className="text-2xl font-bold text-[#140FF0] mb-3">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {path.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[#EBF00F] mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-[#140FF0] hover:bg-[#0f0bc0] text-white">
                  Start Path
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Button onClick={goHome} variant="outline" className="mb-6">
              ← Back to Paths
            </Button>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#140FF0] mb-2">{selectedPath.title}</h2>
                  <p className="text-gray-600">{selectedPath.description}</p>
                </div>
                <Button onClick={resetPath} variant="outline" size="sm" className="flex items-center gap-2">
                  <RotateCcw size={16} /> Reset
                </Button>
              </div>

              {/* YouTube Embed */}
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedPath.youtubeId}?autoplay=${isPlaying ? 1 : 0}`}
                  title="Meditation Music"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Progress — capped at 100% */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.min(completedSteps.length, selectedPath.steps.length)} / {selectedPath.steps.length} steps</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#140FF0] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((completedSteps.length / selectedPath.steps.length) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="bg-gradient-to-r from-[#140FF0]/10 to-[#EBF00F]/10 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#140FF0] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {currentStep + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-[#140FF0]">Current Step</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedPath.steps[currentStep]}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 bg-[#140FF0] hover:bg-[#0f0bc0] text-white py-6 text-lg"
                >
                  {isPlaying ? <><Pause className="mr-2" /> Pause Music</> : <><Play className="mr-2" /> Play Music</>}
                </Button>
                <Button
                  onClick={handleStepComplete}
                  className="flex-1 bg-[#EBF00F] text-[#140FF0] hover:bg-[#d4d60d] py-6 text-lg"
                >
                  <CheckCircle className="mr-2" />
                  {currentStep < selectedPath.steps.length - 1 ? "Next Step" : "Complete Path"}
                </Button>
              </div>
            </div>

            {/* All Steps Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-[#140FF0] mb-6">All Steps</h3>
              <div className="space-y-4">
                {selectedPath.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 p-4 rounded-xl transition-all ${
                      index === currentStep
                        ? "bg-[#140FF0]/10 border-2 border-[#140FF0]"
                        : completedSteps.includes(index)
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                      completedSteps.includes(index) ? "bg-green-500 text-white"
                        : index === currentStep ? "bg-[#140FF0] text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {completedSteps.includes(index) ? "✓" : index + 1}
                    </div>
                    <p className={index === currentStep ? "text-gray-900 font-medium" : "text-gray-600"}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}