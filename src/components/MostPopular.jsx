import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../lib/formatters";

const MostPopular = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPopular = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("is_highlighted", { ascending: false })
                .order("created_at", { ascending: false })
                .limit(3);

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching popular products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopular();
        const channel = supabase
            .channel("popular-products-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchPopular)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const [featured, second, third] = products;

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
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-gray-400" size={36} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Popular products will appear here.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                        {/* Large Featured Item */}
                        {featured && (
                            <Link
                                to={`/product/${featured.id}`}
                                className="md:col-span-8 group relative overflow-hidden bg-gray-100 flex items-center justify-center min-h-[400px] md:min-h-[500px]"
                            >
                                <img
                                    src={featured.image_url || featured.image}
                                    alt={featured.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white p-6 md:p-8 max-w-[280px] md:max-w-sm border border-gray-100 shadow-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-2 md:mb-3 block">
                                        Trending Now
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-2">
                                        {featured.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3">{featured.category || "Collection"}</p>
                                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">
                                        {formatPrice(featured.price)} <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Right column stacked items */}
                        <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
                            {[second, third].filter(Boolean).map((item, idx) => (
                                <Link
                                    key={item.id}
                                    to={`/product/${item.id}`}
                                    className="group relative overflow-hidden bg-gray-100 flex-1 min-h-[250px]"
                                >
                                    <img
                                        src={item.image_url || item.image}
                                        alt={item.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        loading={idx === 0 ? "eager" : "lazy"}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6">
                                        <h3 className="text-white text-lg md:text-xl font-black tracking-tight">{item.name}</h3>
                                        <p className="text-white/80 text-xs mt-1">{formatPrice(item.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MostPopular;
