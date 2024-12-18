'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../constants/api';


export default function TrialPage() {
    const [formData, setFormData] = useState({
        name: '',
        customerEmail: '',
        phoneNumber: '',
        facebookId: '',
        image: null,
        packageId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [packages, setPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/packages/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: 1,
                        limit: 10,
                        packageType: 'trial'
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch packages');
                }

                const data = await response.json();
                setPackages(data.packages || []);
            } catch (err) {
                console.error('Error fetching packages:', err);
            } finally {
                setPackagesLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('customerEmail', formData.customerEmail);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('facebookId', formData.facebookId);
            formDataToSend.append('packageId', formData.packageId);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            } else {
                throw new Error('Please select a screenshot to upload');
            }

            if (!formData.packageId) {
                throw new Error('Please select a package');
            }

            const response = await fetch('http://localhost:8000/order/createTrialOrder', {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit trial request');
            }

            const data = await response.json();
            setSuccess(true);
            setFormData({
                name: '',
                customerEmail: '',
                phoneNumber: '',
                facebookId: '',
                image: null,
                packageId: ''
            });

            // Reset file input
            const fileInput = document.getElementById('screenshot');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-semibold text-green-800 mb-2">
                            Trial Request Submitted!
                        </h2>
                        <p className="text-green-600 mb-4">
                            We'll review your request and get back to you soon.
                            Check your email for login credentials.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Request a Trial</h1>

                    {/* Package Selection Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Package</h2>
                        {packagesLoading ? (
                            <div className="flex justify-center items-center h-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {packages.map((pkg) => (
                                    <label
                                        key={pkg.id}
                                        className={`relative flex p-4 cursor-pointer rounded-lg border ${
                                            formData.packageId === pkg.id.toString()
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="packageId"
                                            value={pkg.id}
                                            checked={formData.packageId === pkg.id.toString()}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500">Price:</p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        ৳{pkg.priceInBdt} / ${pkg.priceInUsd}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Duration:</p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        {pkg.durationValue} {pkg.durationType}
                                                        {pkg.durationValue > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                                                formData.packageId === pkg.id.toString()
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : 'border-gray-300'
                                            }`}>
                                                {formData.packageId === pkg.id.toString() && (
                                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="customerEmail"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="facebookId" className="block text-sm font-medium text-gray-700">
                                Facebook ID
                            </label>
                            <input
                                type="text"
                                id="facebookId"
                                name="facebookId"
                                value={formData.facebookId}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">
                                Upload Screenshot
                            </label>
                            <input
                                type="file"
                                id="screenshot"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-md px-4 py-2 text-white font-medium ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Submitting...' : 'Submit Trial Request'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
