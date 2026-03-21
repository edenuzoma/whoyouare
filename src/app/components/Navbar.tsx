import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  // Use name from route param, fallback to localStorage, then "user"
  const userName = name ||
    (() => {
      try {
        const url = localStorage.getItem("evata_social_url") || "";
        if (!url) return "user";
        const parsed = new URL(url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        const slug = parts[parts.length - 1] || "user";
        return slug.split("-")[0].split("_")[0].toLowerCase() || "user";
      } catch { return "user"; }
    })();

  const handleLogout = () => {
    localStorage.removeItem("evata_user");
    localStorage.removeItem("evata_profile");
    localStorage.removeItem("evata_social_url");
    localStorage.removeItem("evata_social_type");
    navigate("/");
  };

  const links = [
    { to: `/analysis/${userName}`, label: "Profile Analysis" },
    { to: `/journal/${userName}`, label: "Journal" },
    { to: `/medipath/${userName}`, label: "Medipath" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#140FF0] text-white hover:bg-[#0f0bc0] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed top-0 left-0 h-full bg-[#140FF0] text-white w-64 z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="pt-20 px-6 flex flex-col gap-6">
          <div className="text-2xl font-bold text-[#EBF00F] mb-8">WhoYouAre</div>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-lg hover:text-[#EBF00F] transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-auto mb-8">
            <button
              onClick={handleLogout}
              className="text-lg hover:text-[#EBF00F] transition-colors py-2 w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30" />
      )}
    </>
  );
}