"use client";
import React, { useEffect, useState } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="border p-4 mb-6 rounded shadow-sm">
            <h3 className="font-semibold mb-2">
              Order #{order.order_id} - {new Date(order.order_date).toLocaleString()}
            </h3>
            <p className="text-gray-600 mb-2">Status: {order.status}</p>
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center border-b py-2">
                  <div className="flex gap-4 items-center">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded" />
                    <span>{item.name}</span>
                  </div>
                  <div>
                    <span>Qty: {item.quantity}</span><br />
                    <span>₹{item.price}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold mt-2">Total: ₹{order.total_price}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
