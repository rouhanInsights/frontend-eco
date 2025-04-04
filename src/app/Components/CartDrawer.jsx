"use client"; // This must be a client component

import { useCart } from "./CartContext";
import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Link from "next/link";

const CartDrawer = () => {
  const { cart, removeFromCart, adjustQuantity, isCartOpen, closeCart } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform ${isCartOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={closeCart} className="p-2 text-gray-600 hover:text-gray-900">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex items-center border p-2 rounded-lg shadow-sm">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" onError={(e) => (e.target.src = "/fallback.png")} />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold">{item.name} ({item.option})</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustQuantity(item.id, item.option, item.quantity - 1)}
                    className="text-gray-600 hover:text-gray-900 p-1"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <p className="text-gray-600">{item.quantity}</p>
                  <button
                    onClick={() => adjustQuantity(item.id, item.option, item.quantity + 1)}
                    className="text-gray-600 hover:text-gray-900 p-1"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-green-600 font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button onClick={() => removeFromCart(item.id, item.option)} className="text-red-600 hover:text-red-800">
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="p-4 border-t">
          <Link href="/Pages/Cart" passHref>
            <button
              onClick={closeCart}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Cart
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
