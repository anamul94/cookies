"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FCB929] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex items-center space-x-2">
            <Image src="/AccsTool.png" alt="Accstool Logo" width={40} height={40} />
            <div>
              <h3 className="text-[#5C3D14] text-lg font-bold">Accstool</h3>
              <p className="text-[#5C3D14] text-sm">
                Empowering businesses with innovative solutions
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#5C3D14] text-lg font-bold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/about"
                  className="text-[#5C3D14] hover:text-[#5C3D14] text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-[#5C3D14] hover:text-[#5C3D14] text-sm"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/trial"
                  className="text-[#5C3D14] hover:text-[#5C3D14] text-sm"
                >
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Info */}
          <div>
            <h3 className="text-[#5C3D14] text-lg font-bold mb-2">Support</h3>
            <ul className="space-y-1">
              <li className="text-[#5C3D14] text-sm">
                <a href="mailto:accstoolg@gmail.com" className="hover:underline">
                  Email: accstoolg@gmail.com
                </a>
              </li>
              <li className="text-[#5C3D14] text-sm">
                <a href="https://wa.me/message/6UD4YOCQHTLAM1" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp
                </a>
              </li>
              <li className="text-[#5C3D14] text-sm">
                <a href="https://www.facebook.com/AccsTools" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-[#5C3D14]">
          <p className="text-sm text-center text-[#5C3D14]">
            {new Date().getFullYear()} Accstool. All rights reserved | Developed By{" "}
            <Link
              href="https://fusionpulsetech.com/"
              className="font-bold text-[#2B2B2B] hover:text-[#2B2B2B] transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fusion Pulse Tech
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
