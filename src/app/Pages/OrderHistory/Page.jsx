"use client";

import  { useEffect, useState } from "react";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Link from "next/link";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-72 pb-20 bg-gray-50 min-h-screen">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          🧾 My Order History
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">You haven’t placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Order #{order.order_id}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(order.order_date).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-4">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    {order.payment_method}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                    {order.payment_status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Date:</span>{" "}
                  {new Date(order.payment_date).toLocaleString()}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Items in this order:</h4>
                <ul className="space-y-3">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center border-b border-gray-100 pb-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover shadow"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700 font-semibold">₹{item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right font-bold text-lg mt-6 text-gray-800">
                Total Paid: ₹{order.total}
              </div>
            </div>
          ))
        )}

        <div className="text-center mt-12">
          <Link href="/">
            <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-xl font-semibold shadow-md transition">
              Continue Shopping 🛍️
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
