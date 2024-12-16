import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Status } from '@/app/constants/status';
import { fetchWithAuth } from '@/utils/api';

export default function ProductEditModal({ isOpen, onClose, product, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    cookie: '',
    status: Status.ACTIVE
  });
  const [loading, setLoading] = useState(false);
  const [changedFields, setChangedFields] = useState({});

  // Update formData when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        url: product.url || '',
        cookie: typeof product.cookie === 'object' 
          ? JSON.stringify(product.cookie, null, 2) 
          : product.cookie || '',
        status: product.status || Status.ACTIVE
      });
      // Reset changed fields when product changes
      setChangedFields({});
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Track changed fields
    if (product && product[field] !== value) {
      setChangedFields(prev => ({
        ...prev,
        [field]: true
      }));
    } else {
      // Remove field from changedFields if it matches original value
      const newChangedFields = { ...changedFields };
      delete newChangedFields[field];
      setChangedFields(newChangedFields);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {};
      Object.keys(changedFields).forEach(field => {
        let value = formData[field];
        if (field === 'cookie' && changedFields.cookie) {
          try {
            value = JSON.parse(formData.cookie);
          } catch (e) {
            console.log('Cookie is not a valid JSON, keeping as string');
          }
        }
        updateData[field] = value;
      });

      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      console.log('Sending update request:', {
        url: `http://localhost:8000/products/${product.id}`,
        method: 'PUT',
        data: updateData
      });

      const response = await fetchWithAuth(
        `http://localhost:8000/products/${product.id}`,
        {
          method: 'PUT',
          body: updateData, // fetchWithAuth will handle JSON.stringify
        }
      );

      if (!response) return;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update product');
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            type="url"
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cookie
          </label>
          <textarea
            rows={4}
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md font-mono"
            value={formData.cookie}
            onChange={(e) => handleInputChange('cookie', e.target.value)}
            placeholder="Enter cookie data in JSON format or as text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value={Status.ACTIVE}>Active</option>
            <option value={Status.INACTIVE}>Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || Object.keys(changedFields).length === 0}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (loading || Object.keys(changedFields).length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 