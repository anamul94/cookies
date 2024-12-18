import React from 'react';
import PropTypes from 'prop-types';
import { Status } from '@/app/constants/status';

export default function Package({
  id,
  title,
  description,
  priceInUsd,
  priceInBdt,
  durationValue,
  durationType,
  status,
  imageUrl,
  onEdit
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${status === Status.ACTIVE
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
              }`}
          >
            {status}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">${priceInUsd}</div>
            <div className="text-sm text-gray-500">৳{priceInBdt}</div>
          </div>
          <div className="text-sm text-gray-600">
            {durationValue} {durationType}
          </div>
        </div>
        <button
          onClick={() => onEdit(id)}
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit Package
        </button>
      </div>
    </div>
  );
}
