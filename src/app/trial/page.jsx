"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../constants/api";

export default function TrialPage() {
  const [formData, setFormData] = useState({
    name: "",
    customerEmail: "",
    phoneNumber: "",
    facebookId: "",
    image: null,
    packageId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/packages/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: 1,
            limit: 10,
            packageType: "trial",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }

        const data = await response.json();
        setPackages(data.packages || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("customerEmail", formData.customerEmail);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("facebookId", formData.facebookId);
      formDataToSend.append("packageId", formData.packageId);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      } else {
        throw new Error("Please select a screenshot to upload");
      }

      if (!formData.packageId) {
        throw new Error("Please select a package");
      }

      const response = await fetch(
        `${API_BASE_URL}/order/createTrialOrder`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit trial request");
      }

      const data = await response.json();
      setSuccess(true);
      setFormData({
        name: "",
        customerEmail: "",
        phoneNumber: "",
        facebookId: "",
        image: null,
        packageId: "",
      });

      // Reset file input
      const fileInput = document.getElementById("screenshot");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              Trial Request Submitted!
            </h2>
            <p className="text-green-600 mb-4">
              We'll review your request and get back to you soon. Check your
              email for login credentials.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-[#5C3D14] mb-6">
            Request a Trial
          </h1>

          {/* Package Selection Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#5C3D14] mb-4">
              Select a Package
            </h2>
            {packagesLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3557]"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {packages.map((pkg) => (
                  <label
                    key={pkg.id}
                    className={`relative flex p-4 cursor-pointer rounded-lg border ${formData.packageId === pkg.id.toString()
                        ? "border-[#1D3557] bg-[#1D3557]/10"
                        : "border-gray-200 hover:border-[#1D3557]"
                      }`}
                  >
                    <input
                      type="radio"
                      name="packageId"
                      value={pkg.id}
                      checked={formData.packageId === pkg.id.toString()}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#5C3D14]">
                        {pkg.title}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#5C3D14]/70">Price:</p>
                          <p className="text-lg font-medium text-[#5C3D14]">
                            ৳{pkg.priceInBdt} / ${pkg.priceInUsd}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#5C3D14]/70">Duration:</p>
                          <p className="text-lg font-medium text-[#5C3D14]">
                            {pkg.durationValue} {pkg.durationType}
                            {pkg.durationValue > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${formData.packageId === pkg.id.toString()
                            ? "border-[#1D3557] bg-[#1D3557]"
                            : "border-gray-300"
                          }`}
                      >
                        {formData.packageId === pkg.id.toString() && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#5C3D14]"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
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
                htmlFor="facebookId"
                className="block text-sm font-medium text-[#5C3D14]"
              >
                Facebook Profile Link
              </label>
              <input
                type="url"
                id="facebookId"
                name="facebookId"
                required
                value={formData.facebookId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-[#1D3557] shadow-sm focus:border-[#1D3557] focus:ring-[#1D3557] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="screenshot"
                className="block text-sm font-medium text-[#5C3D14]"
              >
                Upload Facebook Screenshot <span className="text-xs">(Follow us on <a href="https://www.facebook.com/AccsTools" target="_blank" rel="noopener noreferrer" className="text-[#FCB929] hover:text-[#FCB929]">Facebook</a>  to get  trial)</span>
              </label>
              <input
                type="file"
                id="screenshot"
                name="screenshot"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-[#5C3D14]
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#1D3557] file:text-white
                hover:file:bg-[#FCB929]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1D3557] hover:bg-[#FCB929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FCB929] ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Submitting..." : "Submit Trial Request"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
