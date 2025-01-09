"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAuthToken } from "@/utils/auth";
import { API_BASE_URL } from "@/app/constants/api";

const OrderStatus = {
  ACTIVE: "active",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  PROCESSING: "processing",
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
  const [editStatus, setEditStatus] = useState("");

  // Fetch orders from the server
  const fetchOrders = useCallback(async () => {
    try {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/order/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page,
          limit,
          customerEmail: customerEmail || undefined,
          status: status || undefined,
        }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log(data);
      setOrders(data?.orders);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, customerEmail, status, router]);

  // Update order status
  const updateOrder = async (orderId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: editStatus }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      fetchOrders();
      cancelEditing();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const startEditing = (order) => {
    setEditingOrder(order.id);
    setEditStatus(order.status);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditStatus("");
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:justify-between mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-4">
            <input
              type="email"
              placeholder="Filter by email"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-72 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 px-4 py-2"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 sm:mt-0 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-48 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 px-4 py-2"
            >
              <option value="">All Status</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </header>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.customerEmail}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">${order.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.paymentMethod}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.transactionNumber}</td>
                      <td className="px-6 py-4 text-sm">
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
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                              order.status === OrderStatus.ACTIVE
                                ? "bg-green-100 text-green-800"
                                : order.status === OrderStatus.PROCESSING
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === OrderStatus.EXPIRED
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          {editingOrder === order.id ? (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => updateOrder(order.id)}
                              >
                                Save
                              </button>
                              <button className="text-gray-600 hover:text-gray-900" onClick={cancelEditing}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="text-blue-600 hover:text-blue-900">View</button>
                              <button className="text-indigo-600 hover:text-indigo-900" onClick={() => startEditing(order)}>
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

            <footer className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 border rounded-md ${
                    page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= totalPages}
                  className={`px-4 py-2 border rounded-md ${
                    page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
