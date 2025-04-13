"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaChevronDown,
} from "react-icons/fa";

const locations = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Surat", "Nagpur",
  "Indore", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi",
  "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad",
  "Guwahati", "Jodhpur", "Coimbatore", "Vijayawada", "Madurai",
];

const Navbar = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/"; // redirect after logout

  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        // console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);




  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md h-60">
      <div className="container flex items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" passHref>
            <Image
              src="/Images/logo.png"
              alt="Calcutta Fresh Foods Logo"
              width={300}
              height={30}
              className="h-40 cursor-pointer"
            />
          </Link>
        </div>

        {/* Search */}
        <form
          action={`/Pages/Search`} // base path
          method="GET"
          className="flex-grow mx-4 relative"
        >
          <input
            type="text"
            name="query" // important for query param!
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 h-12"
            placeholder="Search for Products..."
          />

          {/* Visual Search Icon (not clickable) */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
        </form>


        {/* Location and Login/Profile */}
        <div className="flex items-center space-x-4">
          {/* Location Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-4 bg-gray-100"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
            >
              <FaMapMarkerAlt className="text-black" />
              <span className="text-black">{selectedLocation}</span>
            </button>

            {/* Dropdown Menu */}
            {isLocationOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 shadow-md rounded-md p-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Search location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className="max-h-60 overflow-y-auto mt-2">
                  {locations
                    .filter((location) =>
                      location.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((location, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedLocation(location);
                          setIsLocationOpen(false);
                        }}
                      >
                        {location}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Login/Profile or Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/Pages/Profile">
                <img
                  src={user?.image_url ? user.image_url : "/Images/profile.jpg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer object-cover"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/Pages/Login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </Link>
          )}
          <Link href="/Pages/OrderHistory">
            <button className="text-sm text-blue-600 hover:underline">My Orders</button>
          </Link>

          <Link href="/Pages/Cart">
            <button className="bg-red-500 text-white rounded-full py-2 px-4">
              <FaShoppingCart />
            </button>
          </Link>
        </div>
      </div>

      {/* Categories Dropdown */}
      <div className="container mx-auto flex items-center justify-between px-4 mt-6">
        <div className="relative ml-8">
          <button
            className="bg-green-600 text-white rounded-full py-3 px-6 flex items-center space-x-2 text-lg"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span>Shop by Category</span>
            <FaChevronDown />
          </button>
          {isCategoryOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md">
              <ul className="py-2">
                {[
                  "Exclusive Fish & Meat",
                  "Fish & Seafood",
                  "Mutton",
                  "Poultry",
                  "Steak & Fillets",
                ].map((category) => (
                  <li key={category}>
                    <Link
                      href={`/Pages/Category?name=${encodeURIComponent(category)}`}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
