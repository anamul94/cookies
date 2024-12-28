"use server";

import Product from "../../components/product";
import PurchaseForm from "./PurchaseForm";
import { API_BASE_URL } from "../../constants/api";

async function getPackageData(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch package data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
}

export default async function PurchasePage({ params }) {
  const packageData = await getPackageData(params.id);

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-3xl font-semibold">Error</h2>
          <p className="text-lg mt-2">Package not found</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-gray-900 py-8 text-center">
        <h1 className="text-4xl font-extrabold">Purchase Package</h1>
        <p className="text-lg mt-2">Complete your purchase below</p>
      </div>

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Package Details Section */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Package Details
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {packageData.title}
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  Price: ${packageData.priceInUsd} / ৳{packageData.priceInBdt}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  Duration
                </h4>
                <p className="text-gray-600">
                  {packageData.durationValue} {packageData.durationType}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  Products Included
                </h4>
                <div className="mt-4 space-y-3">
                  {packageData.products?.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <Product title={product.title} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Form Section */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Your Purchase
            </h2>
            <PurchaseForm packageData={packageData} />
          </div>
        </div>
      </main>
    </div>
  );
}
