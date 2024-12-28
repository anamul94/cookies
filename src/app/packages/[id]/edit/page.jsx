"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { fetchWithAuth } from "@/utils/api";
import { isAuthenticated } from "@/utils/auth";
import { Status } from "@/app/constants/status";
import DurationTypes from "@/app/constants/duration";
import PackageOrderType from '@/app/constant/PackageOrderType.enum';
import { API_BASE_URL } from '@/app/constants/api';

export default function EditPackage({ params }) {
  const router = useRouter();
  const id = use(params).id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [packageData, setPackageData] = useState({
    title: "",
    priceInBdt: 0,
    priceInUsd: 0,
    productID: [],
    durationType: DurationTypes.DAYS,
    durationValue: 1,
    status: Status.ACTIVE,
    packageType: PackageOrderType.REGULAR,
    imageUrl: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
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
        setPackageData({
          title: data.title,
          priceInBdt: data.priceInBdt,
          priceInUsd: data.priceInUsd,
          productID: data.products.map(p => p.id),
          durationType: data.durationType,
          durationValue: data.durationValue,
          status: data.status,
          packageType: data.packageType,
          imageUrl: data.imageUrl
        });
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/products/search`,
        {
          method: "POST",
          body: JSON.stringify({
            title: searchTitle,
            page: 1,
            limit: 10,
          }),
        }
      );

      if (!response) return;

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/packages/${id}`, {
        method: "PUT",
        body: JSON.stringify(packageData),
      });

      if (!response) return;

      if (!response.ok) {
        throw new Error("Failed to update package");
      }

      router.push(`/packages/${id}`);
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Failed to update package. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={packageData.title}
                onChange={(e) =>
                  setPackageData({ ...packageData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                value={packageData.imageUrl}
                onChange={(e) =>
                  setPackageData({ ...packageData, imageUrl: e.target.value })
                }
              />
            </div>


            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="priceInBdt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price in BDT
                </label>
                <input
                  type="number"
                  id="priceInBdt"
                  required
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                  value={packageData.priceInBdt}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      priceInBdt: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="priceInUsd"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price in USD
                </label>
                <input
                  type="number"
                  id="priceInUsd"
                  required
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                  value={packageData.priceInUsd}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      priceInUsd: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="productID"
                className="block text-sm font-medium text-gray-700"
              >
                Products
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="productSearch"
                  className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                  placeholder="Search products by title"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`product-${product.id}`}
                      value={product.id}
                      checked={packageData.productID.includes(product.id)}
                      onChange={(e) => {
                        const productID = packageData.productID.slice();
                        if (e.target.checked) {
                          productID.push(product.id);
                        } else {
                          const index = productID.indexOf(product.id);
                          if (index > -1) {
                            productID.splice(index, 1);
                          }
                        }
                        setPackageData({ ...packageData, productID });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {product.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="durationType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration Type
                </label>
                <select
                  id="durationType"
                  required
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                  value={packageData.durationType}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      durationType: e.target.value,
                    })
                  }
                >
                  <option value={DurationTypes.DAYS}>Days</option>
                  <option value={DurationTypes.MONTH}>Month</option>
                  <option value={DurationTypes.YEAR}>Year</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="durationValue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration Value
                </label>
                <input
                  type="number"
                  id="durationValue"
                  required
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                  value={packageData.durationValue}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      durationValue: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="packageType"
                className="block text-sm font-medium text-gray-700"
              >
                Package Type
              </label>
              <select
                id="packageType"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                value={packageData.packageType}
                onChange={(e) =>
                  setPackageData({ ...packageData, packageType: e.target.value })
                }
              >
                <option value={PackageOrderType.REGULAR}>Regular</option>
                <option value={PackageOrderType.TRIAL}>Trial</option>
              </select>
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
                value={packageData.status}
                onChange={(e) =>
                  setPackageData({ ...packageData, status: e.target.value })
                }
              >
                <option value={Status.ACTIVE}>Active</option>
                <option value={Status.INACTIVE}>Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
