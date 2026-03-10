import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LatestProducts from "../components/LatestProducts";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <LatestProducts />
                <Reviews />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
