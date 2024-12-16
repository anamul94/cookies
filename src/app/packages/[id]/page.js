"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function PackageDetails({ params }) {
  const router = useRouter();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/packages/${params.id}`);
        const data = await response.json();
        setPackageData(data);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  if (loading || !packageData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">{packageData.title}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Duration</h3>
              <p>{packageData.durationValue} {packageData.durationType}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className={packageData.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                {packageData.status}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Included Products</h3>
            <div className="space-y-2">
              {packageData.products.map(product => (
                <div key={product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{product.title}</span>
                  <span className={`text-sm ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/packages')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Back
            </button>
            <button
              onClick={() => router.push(`/packages/${params.id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
