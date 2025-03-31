"use client";
import { useState } from "react";
import Head from "next/head";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartContext";

const items = [
  {
    id: 1,
    image:
      "https://storage.googleapis.com/a1aa/image/eobEK9vcu3O9NMGLyNwPXaKFi6-gzjD5DaKxhlKJyHg.jpg",
    title: "Fresh Salmon",
    prices: { "1kg": 299, "500gm": 150, "250gm": 80 },
  },
  {
    id: 2,
    image: "https://storage.googleapis.com/a1aa/image/sample-meat.jpg",
    title: "Organic Chicken",
    prices: { "1kg": 399, "500gm": 200, "250gm": 100 },
  },
  {
    id: 3,
    image: "https://storage.googleapis.com/a1aa/image/sample-fish.jpg",
    title: "Prawns",
    prices: { "1kg": 499, "500gm": 250, "250gm": 130 },
  },
  {
    id: 4,
    image: "https://storage.googleapis.com/a1aa/image/sample-katla.jpg",
    title: "katla",
    prices: { "1kg": 599, "500gm": 300, "250gm": 150 },
  },
  {
    id: 5,
    image: "https://storage.googleapis.com/a1aa/image/sample-bhetki.jpg",
    title: "Bhetki",
    prices: { "1kg": 699, "500gm": 350, "250gm": 180 },
  },
];

function AllProducts() {
  const [startIndex, setStartIndex] = useState(0);
  const [quantities, setQuantities] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );
  const [selectedWeights, setSelectedWeights] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.id]: "1kg" }), {})
  );
  const { addToCart, isCartOpen, setIsCartOpen } = useCart();

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

  const handleAddToCart = (item) => {
    const selectedWeight = selectedWeights[item.id];
    const quantity = quantities[item.id];
    const price = item.prices[selectedWeight];
    addToCart(item, { label: selectedWeight, price }, quantity);
  };

  return (
    <div className="pt-95 bg-gradient-to-b from-green-100 e min-h-screen">
      <Head>
        <title>All Products</title>
      </Head>
      <h1 className="text-4xl font-bold text-green-950 mb-8 pl-8 max-w-xl">ALL PRODUCTS</h1>
      <div className="relative w-full flex items-center justify-center overflow-hidden">
        <button
          onClick={prevSlide}
          className="absolute left-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200"
        >
          <FaChevronLeft className="text-xl text-red-600" />
        </button>
        <div className="grid grid-cols-4 gap-6 p-4">
          {items.slice(startIndex, startIndex + 4).map((item) => (
            <div
              key={item.id}
              className="w-80 h-96 p-4 border rounded-lg shadow-xl flex flex-col items-center text-center bg-white hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-2xl font-bold mt-3 text-gray-800">{item.title}</h2>
              <select
                className="mt-2 border rounded-md p-1 text-lg"
                value={selectedWeights[item.id]}
                onChange={(e) =>
                  setSelectedWeights((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
              >
                {Object.keys(item.prices).map((weight) => (
                  <option key={weight} value={weight}>
                    {weight} - Rs. {item.prices[weight]}
                  </option>
                ))}
              </select>
              <div className="flex items-center mt-3">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-300 px-3 py-1 rounded-l text-xl font-bold hover:bg-gray-400"
                >
                  -
                </button>
                <span className="px-4 py-1 border bg-white text-xl">{quantities[item.id]}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-300 px-3 py-1 rounded-r text-xl font-bold hover:bg-gray-400"
                >
                  +
                </button>
              </div>
              <button onClick={() => handleAddToCart(item)} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg text-lg hover:bg-red-700 transition-all">
                Buy Now
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
      <CartDrawer />
    </div>
  );
}

export default AllProducts;
