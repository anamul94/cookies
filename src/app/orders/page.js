"use client";
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

const OrderStatus = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PROCESSING: "processing"
};

export default function OrdersDashboard() {
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
        customerEmail: '',
        status: ''
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

            const response = await fetch('http://localhost:8000/order/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    page: currentPage,
                    limit,
                    customerEmail: filters.customerEmail || undefined,
                    status: filters.status || undefined
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.orders);
            setTotalOrders(data.total);
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, filters]);

    const handleStatusChange = (newStatus) => {
        setEditingStatus(newStatus);
    };

    const startEditing = (order) => {
        if (order.orderType !== 'regular') {
            alert("This is a trial order. Please update its status from the Trial Orders page.");
            return;
        }
        setEditingOrderId(order.id);
        setEditingStatus(order.status);
    };

    const handleStatusUpdate = async (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order || order.orderType !== 'regular') {
            alert("This is a trial order. Please update its status from the Trial Orders page.");
            setEditingOrderId(null);
            setEditingStatus('');
            return;
        }

        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`http://localhost:8000/order/${orderId}`, {
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

    const cancelEditing = () => {
        setEditingOrderId(null);
        setEditingStatus('');
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const totalPages = Math.ceil(totalOrders / limit);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6">Orders Dashboard</h1>

                    {/* Filters */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                {Object.entries(OrderStatus).map(([key, value]) => (
                                    <option key={value} value={value}>
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="text-center py-4">Loading orders...</div>
                    ) : error ? (
                        <div className="text-center text-red-600 py-4">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
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
                                                {order.transactionNumber || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.orderType || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.customerEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${order.totalPrice || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingOrderId === order.id ? (
                                                    <select
                                                        value={editingStatus}
                                                        onChange={(e) => handleStatusChange(e.target.value)}
                                                        disabled={updatingStatus}
                                                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        {Object.entries(OrderStatus).map(([key, value]) => (
                                                            <option key={value} value={value}>
                                                                {key.charAt(0) + key.slice(1).toLowerCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${order.status === OrderStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                                                        order.status === OrderStatus.EXPIRED ? 'bg-red-100 text-red-800' :
                                                        order.status === OrderStatus.CANCELLED ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                {editingOrderId === order.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id)}
                                                            className="text-green-600 hover:text-green-900 mr-2"
                                                            disabled={updatingStatus}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="text-gray-600 hover:text-gray-900"
                                                            disabled={updatingStatus}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditing(order)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                                                ${currentPage === i + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
