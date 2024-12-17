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
  return (
    <Link href={`/packages/${id}`} className="block group">
      <div className="bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300">
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
          <p
            className={`text-center font-semibold uppercase tracking-wide ${status === "active" ? "text-green-600" : "text-red-500"
              }`}
          >
            Status: {status}
          </p>
        </div>
      </div>
    </Link>
  );
}
