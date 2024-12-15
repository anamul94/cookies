"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Package from '../components/package';

export default function Packages() {
    const router = useRouter();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://localhost:8000/plans', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data) {
                    const packagesArray = Array.isArray(response.data) ? response.data : [response.data];
                    setPackages(packagesArray);
                } else {
                    setError('No data available');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch packages');
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4">Loading packages...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center text-red-600">
                        <h2 className="text-2xl font-semibold">Error</h2>
                        <p>{error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
                    <button
                        onClick={() => router.push('/packages/create')}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add New Package
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {packages.map((pkg) => (
                        <Package
                            key={pkg.id}
                            id={pkg.id}
                            title={pkg.title}
                            description={pkg.description || `Package ${pkg.title}`}
                            price={pkg.price}
                            durationValue={pkg.durationValue}
                            durationType={pkg.durationType}
                            status={pkg.status}
                            onEdit={() => router.push(`/packages/${pkg.id}`)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
