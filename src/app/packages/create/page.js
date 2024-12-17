"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Status } from "@/app/constants/status";
import { isAuthenticated } from "@/utils/auth";
import { fetchWithAuth } from "@/utils/api";
import DurationTypes from "@/app/constants/duration";
import PackageOrderType from '@/app/constant/PackageOrderType.enum';

export default function CreatePackage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:8000/products/search",
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
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", packageData.title);
      formData.append("priceInBdt", packageData.priceInBdt);
      formData.append("priceInUsd", packageData.priceInUsd);
      packageData.productID.forEach((productId) => {
        formData.append("productID", productId);
      });
      formData.append("durationType", packageData.durationType);
      formData.append("durationValue", packageData.durationValue);
      formData.append("status", packageData.status);
      formData.append("packageType", packageData.packageType);
      if (packageData.image) {
        formData.append("image", packageData.image);
      }

      // Convert form data to an object and log it
      const formDataObject = Object.fromEntries(formData.entries());
      console.log("Form Data:", formDataObject);

      const response = await fetchWithAuth("http://localhost:8000/packages/", {
        method: "POST",
        headers: {},
        body: formData,
      });

      if (!response) return;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create package");
      }

      router.push("/packages");
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Failed to create package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Package
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
                value={packageData.title}
                onChange={(e) =>
                  setPackageData({ ...packageData, title: e.target.value })
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
                      priceInBdt: e.target.value,
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
                      priceInUsd: e.target.value,
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
                      durationValue: e.target.value,
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

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                required
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                onChange={(e) =>
                  setPackageData({ ...packageData, image: e.target.files[0] })
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/packages")}
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
                {loading ? "Creating..." : "Create Package"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
