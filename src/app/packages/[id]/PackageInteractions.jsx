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
                    className="w-full bg-[#1D3557] text-white px-6 py-3 rounded-lg hover:bg-[#FCB929] transition-colors mt-6"
                    onClick={handlePurchase}
                >
                    Buy Package
                </button>
            )}
        </div>
    );
}
