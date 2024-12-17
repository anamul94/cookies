import React from 'react';
import Navbar from '../../components/Navbar';
import PackageActions from './PackageActions';

async function getPackageData(id) {
    const response = await fetch(`http://localhost:8000/packages/${id}`, {
        cache: 'no-store'
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch package');
    }
    
    return response.json();
}

export default async function PackageDetails({ params }) {
    const id = params.id;
    const packageData = await getPackageData(id);

    if (!packageData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-600">Failed to load package details</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    {packageData.imageUrl && (
                        <div className="relative h-96 w-full">
                            <img
                                src={packageData.imageUrl}
                                alt={packageData.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">{packageData.title}</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Price</h2>
                                    <div className="space-y-2">
                                        <p className="text-3xl font-bold text-blue-600">৳ {packageData.priceInBdt}</p>
                                        <p className="text-2xl text-gray-600">$ {packageData.priceInUsd}</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Duration</h2>
                                    <p className="text-xl text-gray-700">
                                        {packageData.durationValue} {packageData.durationType}
                                        {packageData.durationValue > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Included Products</h2>
                                <div className="space-y-3">
                                    {packageData.products?.map(product => (
                                        <div
                                            key={product.id}
                                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <span className="font-medium text-gray-800">{product.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4 border-t border-gray-200">
                            <PackageActions id={id} packageData={packageData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}