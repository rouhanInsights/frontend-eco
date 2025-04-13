'use client';

import Navbar from "@/app/Components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CartDrawer from "@/app/Components/CartDrawer";
import { useCart } from "@/app/Components/CartContext";
import Link from "next/link";


export const dynamic = 'force-dynamic'; // Prevents static build crash

const CategoryContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("name");
  const [items, setItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const { addToCart } = useCart();


  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/category?name=${encodeURIComponent(category)}`
        );

        // Check for non-JSON response
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Non-JSON or bad response: ${text}`);
        }

        const data = await res.json();
        console.log("✅ Category Products Response:", data);
        setItems(data);
        const initialQuantities = {};
        const initialWeights = {};
        data.forEach((item) => {
          initialQuantities[item.product_id] = 1;
          initialWeights[item.product_id] = "1kg";
        });
        setQuantities(initialQuantities);
        setSelectedWeights(initialWeights);
      } catch (err) {
        console.error("❌ Failed to fetch category products:", err.message);
      }
    };
    fetchProducts();
  }, [category]);
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
      {  price: basePrice },
      quantity
    );
  };





  return (
    <>
      <Navbar />

      <div className="max-w mx-auto p-6 pt-90">
        <h2 className="text-2xl font-bold mb-4">Category: {category}</h2>
        {items.length === 0 ? (
          <p>No products found.</p>
        ) : (
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
       

        )}
           <CartDrawer/>
      </div>

    </>
  );
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
