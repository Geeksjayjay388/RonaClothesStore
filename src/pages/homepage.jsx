import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LatestProducts from "../components/LatestProducts";
import MostPopular from "../components/MostPopular";
import LatestStories from "../components/LatestStories";
import Footer from "../components/Footer";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <LatestProducts />
                <MostPopular />
                <LatestStories />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
