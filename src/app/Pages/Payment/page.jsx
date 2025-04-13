"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../Components/CartContext";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

const Payment = () => {
  const { cart } = useCart();
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState({ slot_id: null, slot_date: "" });

  const deliveryCharge = 30;
  const discount = 0;

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalAmount = calculateTotal();
  const payableAmount = totalAmount + deliveryCharge - discount;

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (confirm("🔐 You must be logged in to place an order. Go to login page?")) {
          window.location.href = "/Pages/Login";
        }
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/addresses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const defaultAddress = data.find((addr) => addr.is_default);
        if (!defaultAddress) {
          alert("No default address found. Please add one.");
          window.location.href = "/Pages/AddAddress";
          return;
        }
        setUserAddress(defaultAddress);
      } catch (error) {
        console.error("Error fetching default address:", error);
      }
    };

    const storedSlot = localStorage.getItem("deliverySlot");
    if (storedSlot) {
      const parsed = JSON.parse(storedSlot);
      setDeliverySlot({
        slot_id: parsed.slot_id,
        slot_date: parsed.slot_date,
      });
    }

    fetchDefaultAddress();
  }, []);

  const handleOrder = () => {
    if (!userAddress) {
      return alert("User address not available.");
    }

    const token = localStorage.getItem("token");
    const orderPayload = {
      total: payableAmount,
      address: `${userAddress.address_line1}, ${userAddress.city} - ${userAddress.pincode}`,
      slot_id: deliverySlot.slot_id,
      slot_date: deliverySlot.slot_date,
      items: cart,
      payment_method: paymentMethod,
    };

    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Order placed successfully!");
        setOrderSuccess(true);
      })
      .catch((err) => {
        console.error("Order failed:", err);
        alert("Failed to place order.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4 pt-60">
        <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
          {userAddress ? (
            <div className="p-4 border rounded bg-gray-50">
              <p className="font-semibold">{userAddress.name}</p>
              <p>{userAddress.address_line1}, {userAddress.city} - {userAddress.pincode}</p>
              <p>Phone: {userAddress.phone}</p>
            </div>
          ) : (
            <p className="text-red-600">No address found. <Link href="/Pages/AddAddress" className="underline text-blue-600">Add one</Link>.</p>
          )}

          <h2 className="text-2xl font-bold mt-10 mb-4">Select Payment Method</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={() => setPaymentMethod("Cash on Delivery")}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
              />
              Razorpay
            </label>
          </div>

          <div className="mt-10 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex justify-between mt-2">
              <span>Items Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Delivery Charges</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <span>Amount Payable</span>
              <span>₹{payableAmount}</span>
            </div>
          </div>

          {!orderSuccess ? (
            <button
              onClick={handleOrder}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Place Order
            </button>
          ) : (
            <Link
              href="/Pages/OrderConfirmation"
              className="mt-6 block text-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              View Order Confirmation
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;