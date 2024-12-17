"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Package from '../components/package';
import ErrorModal from '../components/ErrorModal';
import Link from 'next/link';
import PackageOrderType from '../constant/PackageOrderType.enum';

export default function Packages() {
    const router = useRouter();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [selectedPackageType, setSelectedPackageType] = useState('all');

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const requestBody = {
                    page,
                    limit
                };

                // Only add packageType to request if it's not 'all'
                if (selectedPackageType !== 'all') {
                    requestBody.packageType = selectedPackageType;
                }

                const response = await axios.post('http://localhost:8000/packages/search', requestBody, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data) {
                    setPackages(response.data.packages || []);
                    setTotal(response.data.total || 0);
                } else {
                    setError('No data available');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch packages');
                setShowErrorModal(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [page, selectedPackageType]);

    const totalPages = Math.ceil(total / limit);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <select
                            value={selectedPackageType}
                            onChange={(e) => {
                                setSelectedPackageType(e.target.value);
                                setPage(1); // Reset to first page when filter changes
                            }}
                            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value={PackageOrderType.REGULAR}>Regular</option>
                            <option value={PackageOrderType.TRIAL}>Trial</option>
                        </select>
                        <button
                            onClick={() => router.push("/packages/create")}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add New Package
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="cursor-pointer" onClick={() => router.push(`/packages/${pkg.id}`)}>
                            <Package
                                id={pkg.id}
                                title={pkg.title}
                                description={pkg.description || `Package ${pkg.title}`}
                                priceInBdt={pkg.priceInBdt}
                                priceInUsd={pkg.priceInUsd}
                                durationValue={pkg.durationValue}
                                durationType={pkg.durationType}
                                imageUrl={pkg.imageUrl}
                                status={pkg.status}
                                packageType={pkg.packageType}
                            />
                        </div>
                    ))}
                </div>

                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-700">
                            Showing page {page} of {totalPages}
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 border rounded-md ${
                                    page === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= totalPages}
                                className={`px-4 py-2 border rounded-md ${
                                    page >= totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <ErrorModal error={error} onClose={() => setShowErrorModal(false)} />
        </div>
    );
}
