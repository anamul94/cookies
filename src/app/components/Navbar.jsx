"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 text-white text-xl font-bold"
            >
              Accstool
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/shop"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive("/shop")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/trial"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive("/trial")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300"
              }`}
            >
              Trial
            </Link>
            <Link
              href="/about"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive("/about")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300"
              }`}
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-600">
            <Link
              href="/shop"
              className={`block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 ${
                isActive("/shop") ? "text-white" : ""
              }`}
            >
              Shop
            </Link>
            <Link
              href="/trial"
              className={`block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 ${
                isActive("/trial") ? "text-white" : ""
              }`}
            >
              Trial
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 ${
                isActive("/about") ? "text-white" : ""
              }`}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
