"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center mr-8">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-auto h-8"
              />
            </div>
            <div className="flex space-x-8">
              <Link
                href="/"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Orders
              </Link>
              <Link
                href="/packages"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname.startsWith('/packages') ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Packages
              </Link>
              <Link
                href="/products"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname.startsWith('/products') ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Products
              </Link>
              <Link
                href="/trial-orders"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname === '/trial-orders' ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Trial Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/' ? 'text-blue-600 bg-gray-50' : 'text-gray-600'
            } hover:text-blue-600 hover:bg-gray-50`}
          >
            Orders
          </Link>
          <Link
            href="/packages"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname.startsWith('/packages') ? 'text-blue-600 bg-gray-50' : 'text-gray-600'
            } hover:text-blue-600 hover:bg-gray-50`}
          >
            Packages
          </Link>
          <Link
            href="/products"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname.startsWith('/products') ? 'text-blue-600 bg-gray-50' : 'text-gray-600'
            } hover:text-blue-600 hover:bg-gray-50`}
          >
            Products
          </Link>
          <Link
            href="/trial-orders"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/trial-orders' ? 'text-blue-600 bg-gray-50' : 'text-gray-600'
            } hover:text-blue-600 hover:bg-gray-50`}
          >
            Trial Orders
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
