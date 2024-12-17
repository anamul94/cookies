"use client";
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const OrderStatus = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PROCESSING: "processing"
};

export default function TrialOrdersDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalOrders, setTotalOrders] = useState(0);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editingStatus, setEditingStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    // Filter state
    const [filters, setFilters] = useState({
        customerEmail: ''
    });

    const fetchOrders = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch('http://localhost:8000/order/search-trial-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    page: currentPage,
                    limit,
                    customerEmail: filters.customerEmail || undefined
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch trial orders');
            }

            const data = await response.json();
            setOrders(data.trialOrders);
            setTotalOrders(data.total);
        } catch (err) {
            setError('Failed to load trial orders. Please try again.');
            console.error('Error fetching trial orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const totalPages = Math.ceil(totalOrders / limit);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleStatusChange = (newStatus) => {
        setEditingStatus(newStatus);
    };

    const handleStatusUpdate = async (orderId) => {
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`http://localhost:8000/order/update-trial-order-status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: editingStatus })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to update status');
            }

            const data = await response.json();
            
            // Refresh the orders list to get the latest data
            await fetchOrders();
            
            setEditingOrderId(null);
            setEditingStatus('');
            
        } catch (err) {
            console.error('Error updating order status:', err);
            if (err.message === 'Failed to update status') {
                alert('Failed to update order status. Please try again.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } finally {
            setUpdatingStatus(false);
        }
    };

    const startEditing = (order) => {
        setEditingOrderId(order.id);
        setEditingStatus(order.status);
    };

    const cancelEditing = () => {
        setEditingOrderId(null);
        setEditingStatus('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6">Trial Orders Dashboard</h1>

                    {/* Filters */}
                    <div className="mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Email
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={filters.customerEmail}
                                onChange={handleFilterChange}
                                placeholder="Filter by email"
                                className="w-full md:w-1/3 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="text-center py-4">Loading trial orders...</div>
                    ) : error ? (
                        <div className="text-center text-red-600 py-4">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trial Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Facebook ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Screenshot
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.customerEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.facebookId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.screenShotUrl && (
                                                    <div className="relative w-20 h-20">
                                                        <a href={order.screenShotUrl} target="_blank" rel="noopener noreferrer">
                                                            <img
                                                                src={order.screenShotUrl}
                                                                alt="Screenshot"
                                                                className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                                                                style={{ width: '100%', height: '100%' }}
                                                            />
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingOrderId === order.id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <select
                                                            value={editingStatus}
                                                            onChange={(e) => handleStatusChange(e.target.value)}
                                                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                                                            disabled={updatingStatus}
                                                        >
                                                            {Object.entries(OrderStatus).map(([key, value]) => (
                                                                <option key={value} value={value}>
                                                                    {key.charAt(0) + key.slice(1).toLowerCase()}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id)}
                                                            disabled={updatingStatus}
                                                            className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            disabled={updatingStatus}
                                                            className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            order.status === OrderStatus.ACTIVE
                                                                ? 'bg-green-100 text-green-800'
                                                                : order.status === OrderStatus.EXPIRED
                                                                ? 'bg-red-100 text-red-800'
                                                                : order.status === OrderStatus.CANCELLED
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                        <button
                                                            onClick={() => startEditing(order)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
