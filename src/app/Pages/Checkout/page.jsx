"use client";

import { useState } from "react";
import { useCart } from "../../Components/CartContext";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import DeliverySlotSelector from "@/app/Components/DeliverySlotSelector";
import Link from "next/link";
import Image from "next/image";

const Checkout = () => {
  const { cart } = useCart();
  const [deliverySlot, setDeliverySlot] = useState({ date: "", time: "" });

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const discount = 40; // Example discount
  const totalAmount = calculateTotal();
  const payableAmount = totalAmount - discount;
  const handlePlaceOrder = () => {
    console.log("Selected Date:", deliverySlot.date);
    console.log("Selected Time Slot:", deliverySlot.time);
    // Send deliverySlot.date & time with your order payload
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-[140px]">
        <div className="flex w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg">
          {/* Delivery Section */}
          <div className="w-2/3 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Select a delivery option</h2>
            {cart.length > 0 && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow">
                <Image src={cart[0].image} alt={`Image of ${cart[0].name}`}  width={50} height={50} />
                <div className="ml-4">
                  <button className="border p-2 text-sm rounded">View {cart.length} Item(s)</button>
                </div>
              </div>
            )}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow">
              <label className="block font-medium">Delivery Slot</label>
              <DeliverySlotSelector onSlotSelect={setDeliverySlot} />
            </div>
            <div className="mt-4">
              <Link href="/payment">
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                  Proceed to payment
                </button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-1/3 p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount Payable</span>
                <span>₹{payableAmount}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold mt-2 bg-green-100 p-2 rounded-lg">
                <span>Total Savings</span>
                <span>₹{discount}</span>
              </div>
              {/* <p className="mt-2 text-sm bg-yellow-100 p-2 rounded-lg"> */}
                {/* <span className="font-semibold">⚠️</span> Select your address and delivery slot to know accurate delivery charges. You can save more by applying a voucher! */}
              {/* </p> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
