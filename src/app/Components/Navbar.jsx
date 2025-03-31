"use client"
import Link from "next/link";
import  { useState,useEffect } from "react";
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

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };


  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md h-60">
      <div className="container flex items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/Images/logo.png"
            alt="Calcutta Fresh Foods Logo"
            width={300}
            height={30}
            className="h-40"
          />
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-b-smpy-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
              placeholder="Search for Products..."
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Location and Login */}
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

          {/* Login/Profile */}
          {isAuthenticated ? (
        <div className="flex items-center gap-4">
          {/* Profile Icon */}
          <Link href="/Pages/Profile">
            <img
              src="/profile-icon.png" // Change this to an actual profile picture URL
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </Link>
          
          {/* Logout Button */}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      ) : (
        <Link href="/Pages/Login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        </Link>
      )}
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
          {/* Dropdown Menu */}
          {isCategoryOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Exclusive Fish & Meat
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Fish & Seafood
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Mutton
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Poultry
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Steak & Fillets
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
