"use Client";
import React from 'react';
import { FaGooglePlay, FaApple, FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-10 px-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="font-bold mb-4">CalcuttaFreshFoods</h2>
          <ul>
            <li className="mb-2  hover:text-red-500"><a href="/Pages/AboutUs">About Us</a></li>
            <li className="mb-2  hover:text-red-500"><a href="#">Our Farms</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Sustainability</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Quality Assurance</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Privacy Policy</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Terms and Conditions</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Careers</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Recipes</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Blog</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold mb-4">Customer Service</h2>
          <ul>
            <li className="mb-2 hover:text-red-500"><a href="#">FAQs</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Shipping & Delivery</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Returns & Refunds</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Order Tracking</a></li>
            <li className="mb-2 hover:text-red-500"><a href="#">Gift Cards</a></li>
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-4 hover:text-red-500">
            <img src="/Images/logo.png" alt="Marnivore logo" width="50" height="10" />
            <p className="mt-2">Premium Quality Meat</p>
          </div>
          <div className="flex space-x-4 mb-4">
            <a className=' hover:text-red-500' href="#"><FaGooglePlay size={32} /></a>
            <a className=' hover:text-red-500'href="#"><FaApple size={32} /></a>
          </div>
          <div className="flex space-x-4">
            <a className=' hover:text-red-500' href="#"><FaFacebookF size={24} /></a>
            <a className=' hover:text-red-500'href="#"><FaInstagram size={24} /></a>
            <a className=' hover:text-red-500'href="#"><FaTwitter size={24} /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;