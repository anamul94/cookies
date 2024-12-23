"use client";

import { useState, useEffect } from "react";
import Package from "./components/package";
import { API_BASE_URL } from "../app/constants/api";
import Link from "next/link";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/packages/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const data = await response.json();
      setPackages(data.packages || []); // Updated to match the API response structure
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Cookie
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover our amazing packages and start your journey today
          </p>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Packages
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">Error: {error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Package
                    key={pkg.id}
                    id={pkg.id}
                    title={pkg.title}
                    priceInUsd={pkg.priceInUsd}
                    priceInBdt={pkg.priceInBdt}
                    durationValue={pkg.durationValue}
                    durationType={pkg.durationType}
                    status={pkg.status}
                    imageUrl={pkg.imageUrl}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  View All Packages
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
