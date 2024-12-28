"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentMethods, PaymentMethodLabels } from "../../constants/enums";
import { API_BASE_URL } from "../../constants/api";

export default function PurchaseForm({ packageId }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerEmail: "",
    customerName: "",
    phoneNumber: "",
    transactionNumber: "",
    paymentMethod: PaymentMethods.BKASH,
    planIds: [parseInt(packageId)],
    currency: "BDT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/order/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to create order");
      }

      const data = await response.json();
      setSuccess({
        message: "Order placed successfully!",
        orderId: data.orderId,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (success) {
    return (
      <div className="bg-[#1D3557] rounded-md p-4">
        <h2 className="text-2xl font-semibold text-white mb-2">
          {success.message}
        </h2>
        <p className="text-white mb-4">Order Number: {success.orderId}</p>
        <button
          onClick={() => router.push("/packages")}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1D3557] hover:bg-[#FCB929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FCB929]"
        >
          Return to Packages
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-[#5C3D14]"
        >
          Full Name
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          required
          value={formData.customerName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="customerEmail"
          className="block text-sm font-medium text-[#5C3D14]"
        >
          Email Address
        </label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          required
          value={formData.customerEmail}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-[#5C3D14]"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="paymentMethod"
          className="block text-sm font-medium text-[#5C3D14]"
        >
          Payment Method
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          required
          value={formData.paymentMethod}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] text-[#1D3557] sm:text-sm"
        >
          {Object.entries(PaymentMethods).map(([key, value]) => (
            <option key={value} value={value} className="text-[#1D3557]">
              {PaymentMethodLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="currency"
          className="block text-sm font-medium text-[#5C3D14]"
        >
          Currency Type
        </label>
        <select
          id="currency"
          name="currency"
          required
          value={formData.currency}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] text-[#1D3557] sm:text-sm"
        >
          <option value="BDT" className="text-[#1D3557]">
            BDT
          </option>
          <option value="USD" className="text-[#1D3557]">
            USD
          </option>
        </select>
      </div>

      <div>
        <label
          htmlFor="transactionNumber"
          className="block text-sm font-medium text-[#5C3D14]"
        >
          Transaction Number
        </label>
        <input
          type="text"
          id="transactionNumber"
          name="transactionNumber"
          required
          value={formData.transactionNumber}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] sm:text-sm"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1D3557] hover:bg-[#FCB929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FCB929] ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Complete Purchase"}
      </button>
    </form>
  );
}
