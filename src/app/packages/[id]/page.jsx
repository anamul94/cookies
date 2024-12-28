import React from "react";
import PackageActions from "./PackageActions";
import { API_BASE_URL } from "../../constants/api";

async function getPackageData(id) {
    const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
        next: {
            revalidate: 300,
        },
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export default async function PackageDetails({ params }) {
    const id = params.id;
    const packageData = await getPackageData(id);

    if (!packageData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg text-[#5C3D14]">Failed to load package details</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            {packageData.imageUrl && (
                <div className="relative bg-[#1D3557] h-96 flex items-center justify-center">
                    <img
                        src={packageData.imageUrl}
                        alt={packageData.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                </div>
            )}

            <div className="max-w-2xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-[#5C3D14] mb-4">
                    {packageData.title}
                </h1>
                {/* <p className="text-lg text-[#5C3D14]">{packageData.description}</p> */}
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="py-4 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Pricing and Duration */}
                            <div className="space-y-6">
                                <div className="p-6 bg-[#1D3557]/10 border border-[#1D3557] rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold text-[#5C3D14] mb-2">
                                        Price
                                    </h2>
                                    <p className="text-3xl font-extrabold text-[#5C3D14]">
                                        $ {packageData.priceInUsd}
                                    </p>
                                    <p className="text-xl font-medium text-[#5C3D14]/70">
                                        ৳ {packageData.priceInBdt}
                                    </p>
                                </div>

                                <div className="p-6 bg-[#1D3557]/10 border border-[#1D3557] rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold text-[#5C3D14] mb-2">
                                        Duration
                                    </h2>
                                    <p className="text-lg text-[#5C3D14]">
                                        {packageData.durationValue} {packageData.durationType}
                                        {packageData.durationValue > 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Included Products */}
                            <div>
                                <h2 className="text-xl font-semibold text-[#5C3D14] mb-4">
                                    Included Products
                                </h2>
                                <div className="space-y-3">
                                    {packageData.products?.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex justify-between items-center p-4 bg-white shadow-sm border border-[#1D3557] rounded-lg hover:shadow-md transition-shadow duration-300"
                                        >
                                            <span className="font-medium text-[#5C3D14]">
                                                {product.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Package Actions */}
                        <PackageActions packageData={packageData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
