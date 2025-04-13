"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartContext";
import Link from "next/link";

function BestSellers() {
  const [items, setItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const { addToCart } = useCart();

  // ✅ Fetch product data from backend
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

  const handleAddToCart = (item) => {
    const quantity = quantities[item.product_id];

    // Determine the effective price: use sale_price if available and lower than price
    const basePrice = item.sale_price && item.sale_price < item.price
      ? item.sale_price
      : item.price;

    // We use a default option label since there's no weight dropdown
    addToCart(
      {
        id: item.product_id,
        name: item.name,
        image: item.image_url,
      },
      { price: basePrice },
      quantity
    );
  };

  return (
    <div className="pt-10 bg-gradient-to-b from-green-100 e min-h-screen">
      <Head>
        <title>All Products</title>
      </Head>
      <h1 className="text-4xl font-bold text-green-950 mb-8 pl-8 max-w-xl">BEST SELLERS</h1>
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
      <CartDrawer />
    </div>
  );
}

export default BestSellers;
