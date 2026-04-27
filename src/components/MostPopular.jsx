import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const MostPopular = () => {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">
                            Most Popular
                        </h2>
                        <p className="mt-4 text-gray-500 text-sm md:text-base font-medium max-w-md">
                            The pieces everyone is talking about. Discover the trending items that define this season's look.
                        </p>
                    </div>
                    <Link
                        to="/store"
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors group mb-1 md:mb-2"
                    >
                        Shop The Edit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

                    {/* Large Featured Item */}
                    <Link to="/store" className="md:col-span-8 group relative overflow-hidden bg-gray-100 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                        <img
                            src="https://images.unsplash.com/photo-1485230895905-ef0f1fdae556?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                            alt="Featured Popular"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white p-6 md:p-8 max-w-[280px] md:max-w-sm border border-gray-100 shadow-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-2 md:mb-3 block">Trending Now</span>
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight mb-2 md:mb-4">The Archive Collection</h3>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">
                                Explore Selection <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    {/* Right column stacked items */}
                    <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
                        <Link to="/store" className="group relative overflow-hidden bg-gray-100 flex-1 min-h-[250px]">
                            <img
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Womenswear"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                            <div className="absolute top-5 left-5 md:top-6 md:left-6">
                                <span className="bg-white/95 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">Womenswear</span>
                            </div>
                        </Link>

                        <Link to="/store" className="group relative overflow-hidden bg-gray-100 flex-1 min-h-[250px]">
                            <img
                                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Accessories"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6">
                                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-tight">Essential Accessories</h3>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MostPopular;
