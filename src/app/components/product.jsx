"use client";

export default function Product({ title, status }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {title}
                </h3>

                {/* Conditionally Render Status */}
                {status && (
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                )}
            </div>
        </div>
    );
}
