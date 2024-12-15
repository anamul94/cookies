"use client";
import Link from 'next/link';

const Package = ({ id, title, description, price, durationValue, durationType, status }) => {
  return (
    <Link href={`/packages/${id}`} className={`block ${status !== 'active' ? 'pointer-events-none' : ''}`}>
      <div 
        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300
          ${status !== 'active' ? 'opacity-50' : ''}`}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            {status !== 'active' && (
              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                Inactive
              </span>
            )}
          </div>
          
          <p className="text-gray-600">{description}</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-blue-600">
                ${price}
              </p>
              <p className="text-gray-500 text-sm">
                Duration: {durationValue} {durationType}
              </p>
            </div>
            
            <button 
              className={`px-6 py-2 rounded-full transition-colors duration-300
                ${status === 'active' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              disabled={status !== 'active'}
              onClick={(e) => {
                e.preventDefault();
                if (status === 'active') {
                  console.log('Selected package:', id);
                }
              }}
            >
              {status === 'active' ? 'Select' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Package;