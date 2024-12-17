"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Package from '../components/package';

export default function Packages() {
    console.log('Component rendered'); // Debug log

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('useEffect triggered'); // Debug log

        // Test if fetch is working
        fetch('http://localhost:8000/')
            .then(res => {
                console.log('Raw response:', res);
                return res.json();
            })
            .then(data => {
                console.log('Fetch data:', data);
            })
            .catch(err => {
                console.error('Fetch error:', err);
            });

        // Original axios call
        const fetchPackages = async () => {
            console.log('Starting axios fetch...'); // Debug log
            try {
                console.log('Before axios call'); // Debug log
                const response = await axios.get('http://localhost:8000/plans', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                console.log('After axios call'); // Debug log
                console.log('Full response:', response); // Debug log

                if (response.data) {
                    console.log('Response data:', response.data);
                    // Temporarily force it into an array if it's not
                    const packagesArray = Array.isArray(response.data) ? response.data : [response.data];
                    setPackages(packagesArray);
                } else {
                    console.log('No data in response');
                    setError('No data available');
                }
            } catch (err) {
                console.error('Detailed error:', {
                    message: err.message,
                    response: err.response,
                    request: err.request,
                    config: err.config
                });
                setError(err.message || 'Failed to fetch packages');
            } finally {
                console.log('Setting loading to false'); // Debug log
                setLoading(false);
            }
        };

        fetchPackages();

        // Cleanup function
        return () => {
            console.log('Component cleanup'); // Debug log
        };
    }, []);

    console.log('Current state:', { loading, error, packagesLength: packages.length }); // Debug log

    if (loading) {
        console.log('Rendering loading state'); // Debug log
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
        console.log('Rendering error state:', error); // Debug log
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center text-red-600">
                        <h2 className="text-2xl font-semibold">Error</h2>
                        <p>{error}</p>
                        <pre className="mt-4 text-left text-sm bg-gray-100 p-4 rounded">
                            {JSON.stringify(error, null, 2)}
                        </pre>
                    </div>
                </main>
            </div>
        );
    }

    console.log('Rendering packages:', packages); // Debug log
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Our Packages
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {packages.map((pkg, index) => (
                        <Package
                            key={pkg.id}
                            id={pkg.id}
                            title={pkg.title}
                            description={pkg.description || `Package ${pkg.title}`}
                            price={pkg.price}
                            duration={`${pkg.durationValue} ${pkg.durationType}`}
                            status={pkg.status}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
