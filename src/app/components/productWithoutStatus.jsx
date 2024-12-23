"use client";

export default function Product({ title }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {title}
                </h3>
                
            </div>
        </div>
    );
}