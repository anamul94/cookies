'use client';

import { useRouter } from 'next/navigation';

export default function PackageActions({ id, packageData }) {
    const router = useRouter();

    const handlePurchase = () => {
        router.push(`/purchase/${id}`);
    };

    return (
        <div>
            {packageData?.status === 'active' ? (
                <button
                    onClick={handlePurchase}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                >
                    Purchase Now
                </button>
            ) : (
                <button
                    disabled
                    className="px-6 py-3 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed"
                >
                    Currently Unavailable
                </button>
            )}
        </div>
    );
}
