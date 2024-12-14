'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function TrialPage() {
    const [formData, setFormData] = useState({
        name: '',
        customerEmail: '',
        phoneNumber: '',
        facebookId: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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
            // Add all text fields
            formDataToSend.append('name', formData.name);
            formDataToSend.append('customerEmail', formData.customerEmail);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('facebookId', formData.facebookId);

            // Add the image file if it exists
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            } else {
                throw new Error('Please select a screenshot to upload');
            }

            const response = await fetch('http://localhost:8000/order/createTrialOrder', {
                method: 'POST',
                body: formDataToSend // Don't set Content-Type header, browser will set it with boundary
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
                image: null
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Request a Trial</h1>

                    {success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <h2 className="text-2xl font-semibold text-green-800 mb-2">
                                Trial Request Submitted!
                            </h2>
                            <p className="text-green-600 mb-4">
                                We'll review your request and get back to you soon.
                                Check your email for login credentials.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Submit Another Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                    required
                                    value={formData.customerEmail}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                    required
                                    value={formData.facebookId}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">
                                    Screenshot
                                </label>
                                <input
                                    type="file"
                                    id="screenshot"
                                    name="image"
                                    accept="image/*"
                                    required
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Please upload a screenshot of your payment
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Submitting...' : 'Submit Trial Request'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
