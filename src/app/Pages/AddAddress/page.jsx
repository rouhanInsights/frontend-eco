"use client";

import React, { useState } from "react";
import Navbar from "@/app/Components/Navbar";
import Link from "next/link";

const AddAddress = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    city: "",
    state: "",
    pincode: "",
    is_default: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/users/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Address added successfully");
        setRedirect(true);
      } else {
        setError(data.error || "Failed to add address");
      }
    } catch (err) {
      console.error("Add address error", err);
      setError("Server error while adding address");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-62">
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", placeholder: "Full Name" },
              { name: "phone", placeholder: "Phone" },
              { name: "address_line1", placeholder: "Address Line 1" },
              { name: "address_line2", placeholder: "Address Line 2" },
              { name: "address_line3", placeholder: "Address Line 3" },
              { name: "city", placeholder: "City" },
              { name: "state", placeholder: "State" },
              { name: "pincode", placeholder: "Pincode" },
            ].map(({ name, placeholder }) => (
              <input
                key={name}
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-3 border rounded-lg"
                required={name !== "address_line2" && name !== "address_line3"}
              />
            ))}

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
                className="mr-2"
              />
              Set as default address
            </label>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Address
            </button>
            {message && (
              <p className="text-green-600 text-center">
                {message} — <Link href="/Pages/Profile" className="underline text-blue-700">Go to Profile</Link>
              </p>
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAddress;