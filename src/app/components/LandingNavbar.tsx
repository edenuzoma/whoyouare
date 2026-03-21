import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import logo from "../../assets/be1536aa33eaa1e671ecb27e22814ced551257e3.png";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="WhoYouAre" className="h-12" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-lg font-medium text-gray-700 hover:text-[#140FF0] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium text-gray-700 hover:text-[#140FF0] transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-[#140FF0] transition-colors py-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-[#140FF0] transition-colors py-2"
              >
                About Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}