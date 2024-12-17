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
      <div className={`bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300 ${!isActive ? 'opacity-70' : ''}`}>
        {/* Image Section */}
        {imageUrl && (
          <div className="relative w-full h-48">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Card Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

          {/* Pricing and Duration */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-bold text-lg text-black mb-2 text-gray-500">Price(USD): ${priceInUsd}</p>
              <p className="text-sm text-gray-500">Price(BDT): ৳{priceInBdt}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Duration:</p>
              <p className="text-lg font-semibold text-gray-800">
                {durationValue} {durationType}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
                }`}
            >
              {status === "active" ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Purchase Button */}
          {isActive ? (
            <Link href={`/packages/${id}`} className="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
              View Details
            </Link>
          ) : (
            <button disabled className="mt-4 block w-full text-center px-4 py-2 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed">
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}