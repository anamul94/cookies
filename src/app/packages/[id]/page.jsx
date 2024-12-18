"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import Navbar from '../../components/Navbar';
import { fetchWithAuth } from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';
import { API_BASE_URL } from '../../../app/constants/api';

export default function PackageDetails({ params }) {
  const router = useRouter();
  const id = use(params).id;
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchPackage = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/packages/${id}`);
        if (!response) return;
        
        if (!response.ok) {
          throw new Error('Failed to fetch package');
        }

        const data = await response.json();
        setPackageData(data);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-600">Package not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg 
              className="mr-2 -ml-1 h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          {/* Image Section */}
          {packageData.imageUrl && (
            <div className="relative w-full h-64">
              <img
                src={packageData.imageUrl}
                alt={packageData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{packageData.title}</h1>
              <button
                onClick={() => router.push(`/packages/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
              >
                Edit Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Price In BDT</h2>
                  <p className="text-3xl font-bold text-blue-600">৳ {packageData.priceInBdt}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Price In USD</h2>
                  <p className="text-3xl font-bold text-blue-600">$ {packageData.priceInUsd}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Duration</h2>
                  <p className="text-xl text-gray-700">
                    {packageData.durationValue} {packageData.durationType}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Status</h2>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    packageData.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {packageData.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Created At</h2>
                  <p className="text-gray-700">{new Date(packageData.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Last Updated</h2>
                  <p className="text-gray-700">{new Date(packageData.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Included Products</h2>
                <div className="space-y-3">
                  {packageData.products.map(product => (
                    <div 
                      key={product.id} 
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="font-medium text-gray-800">{product.title}</span>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}