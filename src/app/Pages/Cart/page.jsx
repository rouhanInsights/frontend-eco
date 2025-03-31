"use client";

import { useState } from "react";
import { useCart } from "../../Components/CartContext";
import Navbar from "../../Components/Navbar";
import Link from "next/link";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Footer from "@/app/Components/Footer";

const relatedItems = [
  {
    id: 101,
    name: "Mutton Curry Cut",
    image: "https://storage.googleapis.com/a1aa/image/sample-mutton.jpg",
    price: 799,
    option: "1kg",
  },
  {
    id: 102,
    name: "Fresh Basa Fillet",
    image: "https://storage.googleapis.com/a1aa/image/sample-basa.jpg",
    price: 299,
    option: "500gm",
  },
  {
    id: 103,
    name: "Chicken Breast Boneless",
    image: "https://storage.googleapis.com/a1aa/image/sample-chicken.jpg",
    price: 450,
    option: "1kg",
  },
  {
    id: 104,
    name: "Prawns Medium",
    image: "https://storage.googleapis.com/a1aa/image/sample-prawns.jpg",
    price: 550,
    option: "500gm",
  },
];

const CartPage = () => {
  const { cart, closeCart, adjustQuantity, addToCart, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-84 px-4 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Your Shopping Cart</h1>

          <div className="bg-white shadow-lg rounded-lg p-6">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-700">{item.name} ({item.option})</h3>
                      <p className="text-green-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => adjustQuantity(item.id, item.option, item.quantity - 1)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      <FaMinus className="w-4 h-4 text-gray-700" />
                    </button>
                    <p className="text-lg font-semibold">{item.quantity}</p>
                    <button
                      onClick={() => adjustQuantity(item.id, item.option, item.quantity + 1)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      <FaPlus className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, item.option)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                    >
                      <FaTrash className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
              <div className="flex justify-between text-lg font-medium mt-4">
                <p>Total Amount:</p>
                <p className="text-green-600">₹{totalAmount.toFixed(2)}</p>
              </div>
              <Link href="/Pages/Checkout">
                <button
                  onClick={closeCart}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          )}

          {/* Related Products Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-medium mt-3">{item.name}</h3>
                  <p className="text-green-600 font-semibold text-lg">₹{item.price}</p>
                  <button
                    onClick={() => addToCart(item, { label: item.option, price: item.price }, 1)}
                    className="mt-3 bg-blue-500 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default CartPage;
