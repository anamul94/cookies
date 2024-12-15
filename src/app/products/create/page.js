"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { Status } from '@/app/constants/status';

export default function CreateProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    title: '',
    url: '',
    cookie: '',
    status: Status.ACTIVE
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse cookie string to JSON if it's a valid JSON
      let cookieData = product.cookie;
      try {
        cookieData = JSON.parse(product.cookie);
      } catch (e) {
        // If parsing fails, keep it as a string
        console.log('Cookie is not a valid JSON, keeping as string');
      }

      const response = await fetch('http://localhost:8000/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          cookie: cookieData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                type="url"
                id="url"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                value={product.url}
                onChange={(e) => setProduct({ ...product, url: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="cookie" className="block text-sm font-medium text-gray-700">
                Cookie (JSON)
              </label>
              <textarea
                id="cookie"
                rows={4}
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md font-mono"
                value={product.cookie}
                onChange={(e) => setProduct({ ...product, cookie: e.target.value })}
                placeholder="Enter cookie data in JSON format or as text"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter cookie data either as a JSON object or as plain text
              </p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                value={product.status}
                onChange={(e) => setProduct({ ...product, status: e.target.value })}
              >
                <option value={Status.ACTIVE}>Active</option>
                <option value={Status.INACTIVE}>Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
