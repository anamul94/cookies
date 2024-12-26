"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2563EB]">
      <div className="max-w-7xl max-h-50 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Accstool</h3>
            <p className="text-blue-100 text-sm line-clamp-2">
              Empowering businesses with innovative solutions for seamless
              customer service management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-blue-100 hover:text-white text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-blue-100 hover:text-white text-sm"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/trial"
                  className="text-blue-100 hover:text-white text-sm"
                >
                  Free Trial
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-blue-100 hover:text-white text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-blue-500">
          <p className="text-sm text-center text-blue-100">
            ©{new Date().getFullYear()} Cookies. All rights reserved | Developed By{" "}
            <Link
              href="https://fusionpulsetech.com/"
              className="font-bold text-white hover:text-blue-200 transition-colors duration-300"
            >
              Fusion Pulse Tech
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
