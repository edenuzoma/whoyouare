import { LandingNavbar } from "../components/LandingNavbar";
import { Footer } from "../components/Footer";
import { Twitter, Linkedin } from "lucide-react";
import edenPhoto from "../../assets/9b6d4b15d5330c48a8989def365f44b9d802795e.png";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#EBF00F]/10 to-[#140FF0]/10">
      <LandingNavbar />
      
      <div className="container mx-auto px-4 py-20">
        {/* About the Project */}
        <div className="max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-center mb-8 text-[#140FF0]">
            About WhoYouAre
          </h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-[#140FF0] mb-6">
              What is WhoYouAre?
            </h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <strong>WhoYouAre</strong> is an innovative AI-powered psychological behavioral platform 
                that helps you understand yourself better through your digital presence. By analyzing 
                your social media profiles on LinkedIn or X (Twitter), we provide deep insights into 
                your communication patterns, personality traits, and behavioral tendencies.
              </p>
              
              <p>
                Our mission is to make self-awareness accessible to everyone. We believe that understanding 
                who you truly are is the first step toward personal growth, better relationships, and a 
                more fulfilling life.
              </p>
              
              <h3 className="text-2xl font-bold text-[#140FF0] mt-8 mb-4">
                Key Features
              </h3>
              
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <div className="bg-[#EBF00F] rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-[#140FF0] rounded-full" />
                  </div>
                  <span>
                    <strong>Profile Analysis:</strong> Get comprehensive psychological insights from 
                    your LinkedIn or X profile, explained in simple, easy-to-understand language.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#EBF00F] rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-[#140FF0] rounded-full" />
                  </div>
                  <span>
                    <strong>Interactive Quiz:</strong> Test how well you know yourself with our 
                    AI-generated quiz based on your profile analysis.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#EBF00F] rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-[#140FF0] rounded-full" />
                  </div>
                  <span>
                    <strong>AI Journal:</strong> Document your thoughts and receive intelligent 
                    analysis of your emotional state and mental patterns.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#EBF00F] rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-[#140FF0] rounded-full" />
                  </div>
                  <span>
                    <strong>Medipath:</strong> Access guided meditation paths with AI-powered 
                    relaxation techniques tailored to your needs.
                  </span>
                </li>
              </ul>
              
              <p className="mt-8">
                WhoYouAre is designed to be your companion in the journey of self-discovery, 
                helping you understand your strengths, identify areas for growth, and develop 
                greater emotional intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* About the Developer */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#140FF0]">
            Meet the Developer
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <img
                src={edenPhoto}
                alt="Eden Uzoma"
                className="w-48 h-48 rounded-full object-cover shadow-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-[#140FF0] mb-4">
                  Eden Uzoma
                </h3>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Eden Uzoma is a passionate software developer and AI enthusiast dedicated to 
                  building tools that solves real problem. With a background 
                  in full-stack development, data science, and AI and a keen interest in psychology and human behavior, 
                  Eden created WhoYouAre as an open-source project to democratize access to 
                  self-awareness tools.
                </p>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Combining technical expertise with a genuine desire to make a positive impact, 
                  Eden believes that technology should serve humanity by helping us become more 
                  self-aware, empathetic, and connected.
                </p>
                
                <div className="flex items-center gap-4">
                  <a
                    href="https://x.com/edenuzoma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#140FF0] text-white px-6 py-3 rounded-full hover:bg-[#0f0bc0] transition-colors"
                  >
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                  
                  <a
                    href="https://linkedin.com/in/edenuzoma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#140FF0] text-white px-6 py-3 rounded-full hover:bg-[#0f0bc0] transition-colors"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
