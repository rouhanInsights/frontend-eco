"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/Components/Navbar";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    alternate_email: "",
    phone: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setForm({
            name: data.name || "",
            alternate_email: data.alternate_email || "",
            phone: data.phone || ""
          });
        }
      } catch (err) {
        setError("Failed to load profile");
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setAddresses(data);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };

    fetchProfile();
    fetchAddresses();
    setLoading(false);
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setError(data.error || "Update failed");
      }
    } catch (err) {
      setError("Error updating profile");
    }
  };

  const setAsDefault = async (addressId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_default: true })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Default address updated.");
        // Refetch addresses to reflect changes
        const updated = await fetch("http://localhost:5000/api/users/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedData = await updated.json();
        setAddresses(updatedData);
      } else {
        setError(data.error || "Failed to update default address");
      }
    } catch (err) {
      console.error("Default address error", err);
      setError("Failed to set default address");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-60 px-4">
        <div className="w-full max-w-2xl bg-white p-6 shadow-md rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="email"
              name="alternate_email"
              value={form.alternate_email}
              onChange={handleChange}
              placeholder="Alternate Email"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Save Changes
            </button>
            {message && <p className="text-green-600 text-center">{message}</p>}
          </form>
        </div>

        {/* Saved Addresses */}
        <div className="w-full max-w-2xl mt-8 bg-white p-6 shadow-md rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Saved Addresses</h2>
            <Link href="/Pages/AddAddress" className="text-blue-600 font-medium underline">Add New</Link>
          </div>
          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses saved yet.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.address_id}
                className={`border p-4 rounded-lg mb-3 ${addr.is_default ? "bg-green-50 border-green-400" : ""}`}
              >
                <p className="font-bold">{addr.name} ({addr.phone})</p>
                <p>{addr.address_line1}, {addr.address_line2}, {addr.address_line3}</p>
                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                {addr.is_default ? (
                  <p className="text-sm text-green-600 font-medium">Default Address</p>
                ) : (
                  <button
                    onClick={() => setAsDefault(addr.address_id)}
                    className="mt-2 text-sm text-blue-600 underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
