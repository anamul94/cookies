'use client';

import { useRouter } from 'next/navigation';

export default function PackageInteractions({ status, id }) {
    const router = useRouter();

    const handlePurchase = () => {
        router.push(`/purchase/${id}`);
    };

    return (
        <div className="space-y-4">
            {status === 'active' && (
                <button 
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6"
                    onClick={handlePurchase}
                >
                    Purchase Package
                </button>
            )}
        </div>
    );
}
