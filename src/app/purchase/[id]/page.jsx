'use server';

import Navbar from '../../components/Navbar';
import Product from '../../components/product';
import PurchaseForm from './PurchaseForm';

async function getPackageData(id) {
    try {
        const res = await fetch(`http://localhost:8000/plan/${id}`, { 
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            throw new Error('Failed to fetch package data');
        }
        
        return res.json();
    } catch (error) {
        console.error('Error fetching package:', error);
        return null;
    }
}

export default async function PurchasePage({ params }) {
    const packageData = await getPackageData(params.id);

    if (!packageData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <div className="text-center text-red-600">
                        <h2 className="text-2xl font-semibold">Error</h2>
                        <p>Package not found</p>
                        <button
                            onClick={() => window.history.back()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Package Details Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Details</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{packageData.title}</h3>
                                <p className="text-3xl font-bold text-blue-600 mt-2">${packageData.price}</p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-700">Duration</h4>
                                <p className="text-gray-600">
                                    {packageData.durationValue} {packageData.durationType}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-700">Products Included</h4>
                                <div className="mt-2 space-y-2">
                                    {packageData.products?.map(product => (
                                        <Product 
                                            key={product.id}
                                            title={product.title}
                                            status={product.status}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Form Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h2>
                        <PurchaseForm packageId={params.id} />
                    </div>
                </div>
            </main>
        </div>
    );
}
