"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import { isAuthenticated, getAuthToken } from '@/utils/auth';
import { API_BASE_URL } from '../app/constants/api';

const OrderStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PROCESSING: 'processing'
};

export default function Home() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState("");
  const [status, setStatus] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const fetchOrders = async () => {
    try {
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      const token = getAuthToken();
      const response = await fetch(`${base_url}/order/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page,
          limit,
          customerEmail: customerEmail || undefined,
          status: status || undefined,
        }),
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      setOrders(Array.isArray(data.data) ? data.data : []);
      setTotal(data.total || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const startEditing = (order) => {
    setEditingOrder(order.id);
    setEditStatus(order.status);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditStatus('');
  };

  const updateOrder = async (orderId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${base_url}/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editStatus
        }),
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      fetchOrders();
      setEditingOrder(null);
      setEditStatus('');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [page, customerEmail, status]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
            <input
              type="email"
              placeholder="Filter by email"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 sm:mt-0 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-48 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">All Status</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Number
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.transactionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingOrder === order.id ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {Object.values(OrderStatus).map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === OrderStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                              order.status === OrderStatus.PROCESSING ? 'bg-yellow-100 text-yellow-800' :
                              order.status === OrderStatus.EXPIRED ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {editingOrder === order.id ? (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => updateOrder(order.id)}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-900"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => {
                                  // Handle view details
                                }}
                              >
                                View
                              </button>
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => startEditing(order)}
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Showing page {page} of {totalPages}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 border rounded-md ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className={`px-4 py-2 border rounded-md ${
                    page >= totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
