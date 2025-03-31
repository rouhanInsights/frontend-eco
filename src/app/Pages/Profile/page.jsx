"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authToken"); // ✅ Ensure correct key
            console.log("🔍 Token Retrieved:", token); // ✅ Debug token
          
            if (!token) {
              console.error("⚠️ No token found in localStorage!");
              setLoading(false);
              return;
            }
          
            try {
              const res = await fetch("http://localhost:5000/api/profile", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // ✅ Ensure correct token format
                },
              });
          
              const data = await res.json();
              console.log("🔍 API Response:", data); // ✅ Debug API response
          
              if (res.ok) {
                setUser(data.user);
                setIsAuthenticated(true);
              } else {
                console.error("❌ Error fetching user:", data.message);
              }
            } catch (error) {
              console.error("❌ Fetch Error:", error);
            } finally {
              setLoading(false);
            }
          };
        fetchUser();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    if (!isAuthenticated) {
        return (
            <div className="text-center mt-10">
                <p>You are not logged in.</p>
                <Link href="/Pages/Login" className="text-blue-500 underline">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>

            {/* ✅ Back to Home Button */}
            <div className="mt-4">
                <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Profile;
