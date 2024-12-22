'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { API_BASE_URL } from '../../../app/constants/api';

const OrderStatus = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PROCESSING: 'processing'
};

export default function OrderDetails({ params }) {
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingOrderStatus, setEditingOrderStatus] = useState('');
    const [editingItemStatus, setEditingItemStatus] = useState({
        itemId: null,
        status: ''
    });
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrderDetails = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/order/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setOrder(data.response.order);
            setOrderItems(data.response.orderItems);
        } catch (err) {
            setError('Failed to load order details');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchOrderDetails();
        }
    }, [params.id]);

    const handleOrderStatusUpdate = async () => {
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/order/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: editingOrderStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            await fetchOrderDetails();
            setEditingOrderStatus('');
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleOrderItemStatusUpdate = async () => {
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/order/update-order-item-status/${editingItemStatus.itemId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: editingItemStatus.status })
            });

            if (!response.ok) {
                throw new Error('Failed to update item status');
            }

            await fetchOrderDetails();
            setEditingItemStatus({ itemId: null, status: '' });
        } catch (err) {
            console.error('Error updating item status:', err);
            alert('Failed to update item status. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">Loading order details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-red-600 text-center">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Order Details
                            </h3>
                        </div>
                        
                        {order && (
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.id}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Customer Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.customerEmail}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.phoneNumber || 'N/A'}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Transaction Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.transactionNumber || 'N/A'}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {editingOrderStatus ? (
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={editingOrderStatus}
                                                        onChange={(e) => setEditingOrderStatus(e.target.value)}
                                                        disabled={updatingStatus}
                                                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        {Object.values(OrderStatus).map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={handleOrderStatusUpdate}
                                                        disabled={updatingStatus}
                                                        className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingOrderStatus('')}
                                                        disabled={updatingStatus}
                                                        className="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${order.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                        order.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status}
                                                    </span>
                                                    <button
                                                        onClick={() => setEditingOrderStatus(order.status)}
                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Order Type</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.orderType}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Total Price</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {order.totalPrice} {order.currency}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Order Type</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.orderType}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Ordered At</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(order.createdAt)}</dd>
                                    </div>
                                </dl>
                            </div>
                        )}

                        {orderItems.length > 0 && (
                            <div className="mt-8">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Order Items
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    {orderItems.map((item, index) => (
                                        <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                                            <div className="px-4 py-5 sm:px-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-4">
                                                    Item #{index + 1}
                                                </h4>
                                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Product Title</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{item.product.title}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Package</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{item.package.title}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(item.startDate)}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(item.endDate)}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                        <dd className="mt-1">
                                                            {editingItemStatus.itemId === item.id ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <select
                                                                        value={editingItemStatus.status}
                                                                        onChange={(e) => setEditingItemStatus({
                                                                            ...editingItemStatus,
                                                                            status: e.target.value
                                                                        })}
                                                                        disabled={updatingStatus}
                                                                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    >
                                                                        {Object.values(OrderStatus).map((status) => (
                                                                            <option key={status} value={status}>
                                                                                {status}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <button
                                                                        onClick={handleOrderItemStatusUpdate}
                                                                        disabled={updatingStatus}
                                                                        className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingItemStatus({ itemId: null, status: '' })}
                                                                        disabled={updatingStatus}
                                                                        className="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-100 disabled:opacity-50"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                        ${item.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                        item.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                                        item.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                                        {item.status}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setEditingItemStatus({
                                                                            itemId: item.id,
                                                                            status: item.status
                                                                        })}
                                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Product URL</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            <a href={item.product.url} target="_blank" rel="noopener noreferrer" 
                                                               className="text-blue-600 hover:text-blue-800">
                                                                {item.product.url}
                                                            </a>
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="px-4 py-5 sm:px-6">
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
