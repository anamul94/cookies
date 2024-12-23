"use client";
import React from "react";
import Link from "next/link";

export default function Package({
  id,
  title,
  description,
  priceInUsd,
  priceInBdt,
  durationValue,
  durationType,
  imageUrl,
  status,
  onEdit,
}) {
  const isActive = status === "active";

  return (
    <div className="block group">
      <div
        className={`relative bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-transform transform  duration-300 ${
          !isActive ? "opacity-75" : ""
        }`}
      >
        {/* Image Section */}
        {imageUrl && (
          <div className="relative w-full h-56">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg">
              {status === "active" ? "Available" : "Unavailable"}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h2>

          <p className="text-gray-600 mb-5 text-sm line-clamp-3">
            {description}
          </p>

          {/* Pricing and Duration */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-lg font-semibold text-blue-600">
                Price(USD): <span className="text-black">${priceInUsd}</span>
              </p>
              <p className="text-sm text-gray-500">Price(BDT): ৳{priceInBdt}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Duration:</p>
              <p className="text-lg font-semibold text-gray-800">
                {durationValue} {durationType}
              </p>
            </div>
          </div>

          {/* Buttons */}
          {isActive ? (
            <div className="flex space-x-3">
              <Link
                href={`/packages/${id}`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View Details
              </Link>
              <Link
                href={`/purchase/${id}`}
                className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Buy Now
              </Link>
            </div>
          ) : (
            <button
              disabled
              className="block w-full text-center px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
