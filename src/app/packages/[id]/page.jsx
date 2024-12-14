import Navbar from '../../components/Navbar';
import Product from '../../components/product';
import PackageActions from './PackageActions';
import PackageInteractions from './PackageInteractions';

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

export default async function PackageDetails({ params }) {
    const packageData = await getPackageData(params.id);

    if (!packageData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center text-red-600">
                        <h2 className="text-2xl font-semibold">Error</h2>
                        <p>Package not found</p>
                        <PackageActions />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <PackageActions />

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-4xl font-bold text-gray-900">
                            {packageData.title}
                        </h1>
                        <span 
                            className={`px-3 py-1 rounded-full text-sm ${
                                packageData.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {packageData.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Price</h2>
                                <p className="text-3xl font-bold text-blue-600">${packageData.price}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Duration</h2>
                                <p className="text-gray-600">
                                    {packageData.durationValue} {packageData.durationType}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Products Included</h2>
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

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Package Details</h2>
                                <p className="text-gray-600">
                                    Created: {new Date(packageData.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    Last Updated: {new Date(packageData.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <PackageInteractions 
                                status={packageData.status} 
                                id={packageData.id}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}