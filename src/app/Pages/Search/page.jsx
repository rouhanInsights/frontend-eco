"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                console.log("Search response:", data); // 🔍 Inspect API response

                // Ensure results is an array before setting state
                setResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]); // Avoid errors if the request fails
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="max-w-5xl mx-auto p-6">
            {Array.isArray(results) && results.length === 0 && <p>No products found.</p>}

            {Array.isArray(results) && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.map((item) => (
                        <div key={item.product_id} className="border p-4 rounded shadow">
                            <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover mb-2" />
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p>₹{item.price}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default SearchPage;
