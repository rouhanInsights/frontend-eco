"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/Components/Navbar";
import { useCart } from "@/app/Components/CartContext";
import Footer from "@/app/Components/Footer";

const ProductDetailPage = () => {
  const params = useParams();
  const product_id = params.product_id;

  const [related, setRelated] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const [product, setProduct] = useState(null);



  useEffect(() => {
    if (!product_id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${product_id}`);
        const data = await res.json();
        setProduct(data);

        // fetch related by category
        const relatedRes = await fetch(
          `http://localhost:5000/api/products/related/${data.category_id}/${data.product_id}`
        );
        const relatedData = await relatedRes.json();
        setRelated(relatedData);
        const initialQuantities = {};
        const initialWeights = {};
        setQuantities({ [data.product_id]: 1 });
        // setSelectedWeights({ [data.product_id]: "1kg" });
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProduct();
  }, [product_id]);
  const { addToCart } = useCart();

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] > 1 ? prev[id] - 1 : 1 }));
  };

 
  if (!product) return <div className="p-8 text-lg">Loading product details...</div>;

  return (
    <>
      <Navbar />
      <div className="mt-6 bg-white p-6 rounded shadow-lg max-w-5xl mx-auto pt-60">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="mt-2 text-lg">
                {product.sale_price && product.sale_price < product.price ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-red-600 font-bold">
                      ₹{Number(product.sale_price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-800 font-semibold">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                )}
              </p>
              <p className="text-gray-600 mt-4">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex products-center mt-6">
              <button
                onClick={() => decreaseQuantity(product.product_id)}
                className="bg-gray-300 px-3 py-1 rounded-l text-xl font-bold hover:bg-gray-400"
              >
                -
              </button>
              <span className="px-4 py-1 border bg-white text-xl">
                {quantities[product.product_id]}
              </span>
              <button
                onClick={() => increaseQuantity(product.product_id)}
                className="bg-gray-300 px-3 py-1 rounded-r text-xl font-bold hover:bg-gray-400"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                const qty = quantities[product.product_id] || 1;
                const price = product.sale_price && product.sale_price < product.price
                  ? product.sale_price
                  : product.price;

                addToCart(
                  {
                    id: product.product_id,
                    name: product.name,
                    image: product.image_url,
                  },
                  { label: "default", price },
                  qty
                );
              }}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition-all w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((product) => (
              <div key={product.product_id} className="group bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-[1.03]">
                <Link href={`/Products/${product.product_id}`}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-44 object-cover rounded-lg mb-3 group-hover:opacity-95 transition duration-300"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-md">
                    {product.sale_price && product.sale_price < product.price ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">
                          ₹{Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-red-600 font-bold">
                          ₹{Number(product.sale_price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-semibold">
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </p>
                </Link>

                {/* Quantity + Add to Cart */}
                <div className="mt-4 flex flex-col products-center gap-2">
                  <div className="flex products-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.product_id]: Math.max(1, (prev[product.product_id] || 1) - 1),
                        }))
                      }
                      className="bg-gray-300 text-lg px-2 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border bg-white text-md rounded">
                      {quantities[product.product_id] || 1}
                    </span>
                    <button
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.product_id]: (prev[product.product_id] || 1) + 1,
                        }))
                      }
                      className="bg-gray-300 text-lg px-2 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const qty = quantities[product.product_id] || 1;
                      const price = product.sale_price && product.sale_price < product.price
                        ? product.sale_price
                        : product.price;

                      addToCart(
                        {
                          id: product.product_id,
                          name: product.name,
                          image: product.image_url,
                        },
                        { label: "default", price },
                        qty
                      );
                    }}
                    className="bg-red-600 text-white w-full py-2 rounded-lg shadow hover:bg-red-700 transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>

      )}

      <Footer />
    </>
  );
};

export default ProductDetailPage;
