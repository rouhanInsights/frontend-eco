"use client";
import AllProducts from "./AllProducts";
import BestSellers from "./BestSellers";
import TopOffers from "./TopOffers";

function Header() {
  return (
    <div>
      <AllProducts/>
      <BestSellers/>
      <TopOffers/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="relative w-full h-full">
          <img
            alt="A bowl of meat with red chili peppers on top"
            className="w-full h-full object-cover"
            height="800"
            src="https://storage.googleapis.com/a1aa/image/XhNfMuVk8DM1q2ssqyh2gSKotbMKlfHOxrS6Zmb_Xz0.jpg"
            width="800"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-10  backdrop-blur-xs">
            <h1 className="text-zinc-900 text-3xl md:text-5xl font-bold mb-4 ">Online Meat Shop</h1>
            <p className="text-zinc-900 text-sm md:text-lg mb-6">Using dummy content or fake information in the design process.</p>
            <a className="bg-emerald-950 text-white px-6 py-3 rounded-full text-sm md:text-lg font-semibold" href="#">TO SHOP</a>
          </div>
        </div>

        <div className="relative w-full h-full">
          <img
            alt="A bowl of meat with red chili peppers on top"
            className="w-full h-full object-cover"
            height="800"
            src="https://storage.googleapis.com/a1aa/image/1Rk48R5yImaX7UCKQanrFPabD4XJ_m83FDtdAg6Zhrg.jpg"
            width="800"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-10  backdrop-blur-xs">
            <h1 className="text-zinc-900 text-3xl md:text-5xl font-bold mb-4 ">Fresh Fish</h1>
            <p className="text-zinc-900 text-sm md:text-lg mb-6">Using dummy content or fake information in the design process.</p>
            <a className="bg-emerald-950 text-white px-6 py-3 rounded-full text-sm md:text-lg font-semibold" href="#">Buy Now</a>
          </div>

        </div>
        </div>

    </div>
  )
}

export default Header
