import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const allProducts = [
    { id: 1, name: "Classic T-Shirt", price: "$29.99", category: "Tops", description: "Everyday comfort with premium cotton.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Denim Jacket", price: "$89.99", category: "Outerwear", description: "Timeless style, rugged construction.", image: "https://images.unsplash.com/photo-1551028719-0c1444ba22c0?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Slim Fit Jeans", price: "$59.99", category: "Bottoms", description: "Stretchy, comfortable, perfect fit.", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Sneakers", price: "$119.99", category: "Shoes", description: "Lightweight and stylish for urban adventures.", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" },
    { id: 5, name: "Hoodie", price: "$49.99", category: "Outerwear", description: "Cozy fleece for chilly evenings.", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" },
    { id: 6, name: "Chino Pants", price: "$69.99", category: "Bottoms", description: "Versatile and sharp for any occasion.", image: "https://images.unsplash.com/photo-1624378439575-d8705e4d2578?auto=format&fit=crop&q=80&w=400" },
];

const StorePage = () => {
    const [search, setSearch] = useState("");

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                {/* Graphic Header */}
                <section className="relative min-h-[40vh] flex items-center bg-gray-900 border-b border-gray-800 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
                            alt="Background texture"
                            className="w-full h-full object-cover opacity-20 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    </div>

                    <h1 className="absolute -bottom-10 -right-10 text-[18vw] font-black text-white/5 tracking-tighter z-10 select-none">
                        STORE.
                    </h1>

                    <div className="container mx-auto px-6 lg:px-8 relative z-20 mt-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-xl text-left">
                                <span className="inline-block text-indigo-400 font-bold tracking-[0.4em] uppercase text-xs mb-4">
                                    Full Catalog
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                    Shop <span className="text-indigo-500">All.</span>
                                </h1>
                            </div>

                            <div className="max-w-md w-full relative z-30">
                                <input
                                    type="text"
                                    placeholder="Search the collection..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/15 transition-all text-lg backdrop-blur-sm placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 lg:px-8 py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="bg-gray-100 aspect-square overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow text-left">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{product.category}</p>
                                        <p className="font-bold text-gray-900">{product.price}</p>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-6 flex-grow">{product.description}</p>

                                    <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-colors border border-gray-200 hover:border-gray-900 text-sm tracking-wide">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-xl text-gray-500 font-medium">No products found matching "{search}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StorePage;
