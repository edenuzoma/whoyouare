import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AboutPage } from "./pages/AboutPage";
import { EmailVerification } from "./pages/EmailVerification";
import { ProfileAnalysis } from "./pages/ProfileAnalysis";
import { Journal } from "./pages/Journal";
import { Medipath } from "./pages/Medipath";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/about", Component: AboutPage },
  // Personalised verify route
  { path: "/verify/:name", Component: EmailVerification },
  { path: "/verify", Component: EmailVerification },
  // Personalised analysis route
  { path: "/analysis/:name", Component: ProfileAnalysis },
  { path: "/analysis", Component: ProfileAnalysis },
  // Personalised journal route
  { path: "/journal/:name", Component: Journal },
  { path: "/journal", Component: Journal },
  // Personalised medipath route
  { path: "/medipath/:name", Component: Medipath },
  { path: "/medipath", Component: Medipath },
]);