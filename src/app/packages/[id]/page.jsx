import React from "react";
import PackageActions from "./PackageActions";
import { API_BASE_URL } from "../../constants/api";

async function getPackageData(id) {
  const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch package");
  }

  return response.json();
}

export default async function PackageDetails({ params }) {
  const id = params.id;
  const packageData = await getPackageData(id);

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">Failed to load package details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {packageData.imageUrl && (
        <div className="relative bg-gray-100 h-96 flex items-center justify-center">
          <img
            src={packageData.imageUrl}
            alt={packageData.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <h1 className="relative text-4xl font-extrabold text-white drop-shadow-md">
            {packageData.title}
          </h1>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Pricing and Duration */}
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">
                    Price
                  </h2>
                  <p className="text-3xl font-extrabold text-blue-600">
                    ৳ {packageData.priceInBdt}
                  </p>
                  <p className="text-xl font-medium text-gray-600">
                    $ {packageData.priceInUsd}
                  </p>
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Duration
                  </h2>
                  <p className="text-lg text-gray-700">
                    {packageData.durationValue} {packageData.durationType}
                    {packageData.durationValue > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Included Products */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Included Products
                </h2>
                <div className="space-y-3">
                  {packageData.products?.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-4 bg-white shadow-sm border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
                    >
                      <span className="font-medium text-gray-800">
                        {product.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-8 border-t border-gray-200">
              <PackageActions id={id} packageData={packageData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
