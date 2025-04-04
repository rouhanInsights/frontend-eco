"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Redirect users if needed

const Profile = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          return router.push("/login");
        }

        const data = await res.json();
        if (res.ok) setForm(data);
      } catch (err) {
        setError("Failed to fetch profile.");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data.user)); // Update localStorage
      } else {
        setError(data.error || "Update failed");
      }
    } catch (err) {
      setError("An error occurred while updating.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="Name"
        />
        <input
          name="email"
          type="email"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="Email"
          disabled // Prevent users from editing email
        />
        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          placeholder="Phone"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          Save Changes
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default Profile;
