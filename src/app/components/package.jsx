"use client";
import React from 'react';
import Link from 'next/link';

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
    <Link href={`/packages/${id}`} className="block">
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </button>
        </div>
        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Price (BDT): {priceInBdt}</p>
            <p className="text-gray-800 font-semibold text-lg">
              Price (USD): {priceInUsd}
            </p>
          </div>
          <p className="text-gray-600">
            Duration: {durationValue} {durationType}
          </p>
        </div>
        <p
          className={`mt-4 font-semibold ${
            status === "active" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {status}
        </p>
      </div>
    </Link>
  );
}