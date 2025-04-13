"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

const OrderConfirmation = () => {
  useEffect(() => {
    // Optional: clear cart or cleanup after placing order
    localStorage.removeItem("cart");
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 pt-32">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-xl text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Confirmed!</h2>
          <p className="text-gray-700 mb-6">
            Thank you for your purchase! Your order has been successfully placed and is now being processed.
          </p>
          <p className="text-gray-500 mb-6">You’ll receive an update when your order ships.</p>

          <Link href="/Pages/OrderHistory">
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition">
              View My Orders
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
