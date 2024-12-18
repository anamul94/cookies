"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { Status } from '@/app/constants/status';
import { isAuthenticated } from '@/utils/auth';
import { fetchWithAuth } from '@/utils/api';
import { API_BASE_URL } from '../../../app/constants/api';

// Create a client component for the form
function ProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState({
    id: '',
    title: '',
    url: '',
    cookie: '',
    status: Status.ACTIVE
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const productId = searchParams.get('id');
    if (productId) {
      setIsEditing(true);
      fetchProductDetails(productId);
    }
  }, [searchParams]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/products/${productId}`);
      
      if (!response) return;
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      
      const productData = await response.json();
      
      const cookieString = typeof productData.cookie === 'object' 
        ? JSON.stringify(productData.cookie, null, 2) 
        : productData.cookie;

      setProduct({
        id: productData.id,
        title: productData.title,
        url: productData.url,
        cookie: cookieString,
        status: productData.status || Status.ACTIVE
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      alert('Failed to load product details. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let cookieData = product.cookie;
      try {
        cookieData = JSON.parse(product.cookie);
      } catch (e) {
        console.log('Cookie is not a valid JSON, keeping as string');
      }

      const url = isEditing 
        ? `${API_BASE_URL}/products/${product.id}`
        : `${API_BASE_URL}/products`;
      
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Sending request:', {
        url,
        method,
        data: { ...product, cookie: cookieData }
      });

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...product,
          cookie: cookieData
        }),
      });

      if (!response) return;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      router.push('/products');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Product" : "Create New Product"}
          </h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                URL
              </label>
              <input
                type="url"
                id="url"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                value={product.url}
                onChange={(e) =>
                  setProduct({ ...product, url: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="cookie"
                className="block text-sm font-medium text-gray-700"
              >
                Cookie (JSON)
              </label>
              <textarea
                id="cookie"
                rows={4}
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2 font-mono"
                value={product.cookie}
                onChange={(e) =>
                  setProduct({ ...product, cookie: e.target.value })
                }
                placeholder="Enter cookie data in JSON format or as text"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter cookie data either as a JSON object or as plain text
              </p>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                value={product.status}
                onChange={(e) =>
                  setProduct({ ...product, status: e.target.value })
                }
              >
                <option 
                  value={Status.ACTIVE}
                  className={product.status === Status.ACTIVE ? "text-green-600" : ""}
                >
                  Active
                </option>
                <option 
                  value={Status.INACTIVE}
                  className={product.status === Status.INACTIVE ? "text-red-600" : ""}
                >
                  Inactive
                </option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

// Main page component
export default function CreateProduct() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductForm />
      </Suspense>
    </>
  );
}
