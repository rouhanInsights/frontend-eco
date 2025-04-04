'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export const dynamic = 'force-dynamic'; // Prevents static build crash

const CategoryContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("name");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/category?name=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        console.log("Category Products Response:", data);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch category products", err);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Category: {category}</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((item) => (
            <div key={item.product_id} className="border p-4 rounded shadow">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
