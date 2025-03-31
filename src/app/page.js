import Image from "next/image";
import Navbar from"./Components/Navbar"
import Home from "./Components/Home";
export default function Index() {
  return (
    <div className="className=bg-white text-gray-800">
    <Navbar/>
    <Home/>
    </div>
  );
}
