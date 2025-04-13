"use client";
import { useState, useEffect } from "react";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    fetch("/api/users/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setAddresses);
  }, []);

  const handleAdd = async () => {
    const res = await fetch("/api/users/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const newAddr = await res.json();
    setAddresses(prev => [...prev, newAddr]);
    setFormData({ ...formData, address_line1: "", city: "", pincode: "" }); // reset minimal
  };

  const handleDelete = async (addressId) => {
    await fetch(`/api/users/addresses/${addressId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(prev => prev.filter(addr => addr.address_id !== addressId));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">📍 Saved Addresses</h3>
      <ul className="space-y-3">
        {addresses.map((addr) => (
          <li key={addr.address_id} className="border p-4 rounded bg-gray-50">
            <p className="font-semibold">{addr.name}</p>
            <p>{addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
            <p>📞 {addr.phone}</p>
            <p className="text-xs text-gray-500">{addr.is_default ? "✅ Default Address" : ""}</p>
            <button
              className="text-red-600 text-sm mt-2"
              onClick={() => handleDelete(addr.address_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h4 className="text-lg font-semibold mt-6 mb-2">➕ Add New Address</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Address Line 1"
          value={formData.address_line1}
          onChange={e => setFormData({ ...formData, address_line1: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={e => setFormData({ ...formData, city: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={e => setFormData({ ...formData, state: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={e => setFormData({ ...formData, pincode: e.target.value })}
          className="border p-2 rounded"
        />
        <label className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={formData.is_default}
            onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
          />
          <span>Set as default address</span>
        </label>
      </div>
      <button
        onClick={handleAdd}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Save Address
      </button>
    </div>
  );
};

export default AddressManager;
