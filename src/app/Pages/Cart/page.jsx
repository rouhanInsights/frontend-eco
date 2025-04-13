"use client";

import { useState,useEffect } from "react";
import { useCart } from "../../Components/CartContext";
import Navbar from "../../Components/Navbar";
import Link from "next/link";
import { FaPlus, FaMinus, FaTrash,FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Footer from "@/app/Components/Footer";
const CartPage = () => {
  const { cart, closeCart, adjustQuantity, addToCart, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [items, setItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0)
  const [quantities, setQuantities] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
   useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/products"); // Adjust backend URL if needed
          const data = await res.json();
          setItems(data);
          
  
          // Initialize weights and quantities
          const initialQuantities = {};
          const initialWeights = {};
          data.forEach((item) => {
            initialQuantities[item.product_id] = 1;
            initialWeights[item.product_id] = "1kg";
          });
          setQuantities(initialQuantities);
          setSelectedWeights(initialWeights);
        } catch (err) {
          console.error("Failed to fetch products:", err);
        }
      };
  
      fetchProducts();
    }, []);
  
    const prevSlide = () => {
      setStartIndex((prev) => (prev === 0 ? items.length - 4 : prev - 1));
    };
  
    const nextSlide = () => {
      setStartIndex((prev) => (prev >= items.length - 4 ? 0 : prev + 1));
    };
  
    const increaseQuantity = (id) => {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    };
  
    const decreaseQuantity = (id) => {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] > 1 ? prev[id] - 1 : 1 }));
    };
  
    const handleAddToCart = (product) => {
      const quantity = quantities[product.product_id];
  
      // Determine the effective price: use sale_price if available and lower than price
      const basePrice = product.sale_price && product.sale_price < product.price
        ? product.sale_price
        : product.price;
  
      // We use a default option label since there's no weight dropdown
      addToCart(
        {
          id: product.product_id,
          name: product.name,
          image: product.image_url,
        },
        { price: basePrice },
        quantity
      );
    };
  

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
                      <h3 className="text-lg font-semibold text-gray-700">{item.name} </h3>
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
            <div className="relative w-full flex items-center justify-center overflow-hidden">
                   
                    <div className=" grid grid-cols-4 gap-6 p-4">
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200"
                    >
                      <FaChevronLeft className="text-xl text-red-600" />
                    </button>
                      {items.slice(startIndex, startIndex + 4).map((item) => (
                        <div
                          key={item.product_id}
                          className="w-80 min-h-[500px] p-4 border rounded-lg shadow-xl flex flex-col items-center text-center bg-white hover:shadow-2xl transition-transform transform hover:scale-105"
                        >
                          <Link href={`/Products/${item.product_id}`}>
                <div className="cursor-pointer flex flex-col items-center text-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-70 object-cover rounded-md"
                  />
                  <h2 className="text-2xl font-bold mt-3 text-gray-800">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-lg">
                    {item.sale_price && item.sale_price < item.price ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">
                          ₹{Number(item.price).toFixed(2)}
                        </span>
                        <span className="text-red-600 font-bold">
                          ₹{Number(item.sale_price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-semibold">
                        ₹{Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
                          <div className="flex items-center mt-3">
                            <button
                              onClick={() => decreaseQuantity(item.product_id)}
                              className="bg-gray-300 px-3 py-1 rounded-l text-xl font-bold hover:bg-gray-400"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border bg-white text-xl">
                              {quantities[item.product_id]}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.product_id)}
                              className="bg-gray-300 px-3 py-1 rounded-r text-xl font-bold hover:bg-gray-400"
                            >
                            +
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg text-lg hover:bg-red-700 transition-all"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200"
                    >
                      <FaChevronRight className="text-xl text-red-600" />
                    </button>
                  </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default CartPage;
