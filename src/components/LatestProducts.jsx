import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowRight, Flame } from "lucide-react";
import { supabase } from "../lib/supabase";
import ProductCard from "./ProductCard";

const LatestProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLatest = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(4);
            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error("Error fetching latest products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatest();
        const channel = supabase
            .channel("latest-products-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchLatest)
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <section className="py-24 md:py-32 bg-[#fafafa] relative overflow-hidden">
            {/* Subtle grid texture */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    opacity: 0.4,
                }}
            />

            {/* Glowing backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-red-100/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-10 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-10 h-[2px] bg-red-500"></span>
                            <Flame size={16} className="text-red-500" />
                            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-red-500">Just Dropped</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                            New For <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Sale.</span>
                        </h2>
                    </div>
                    <Link
                        to="/store"
                        className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-red-600 hover:border-red-600 transition-all group"
                    >
                        View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin text-gray-300 mb-4" size={40} />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Loading catalog…</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 font-medium">New pieces coming soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Mobile view all */}
                <Link to="/store" className="md:hidden mt-12 w-full flex items-center justify-center gap-2 py-4 bg-white shadow-xl rounded-2xl font-black text-gray-900 text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                    View All Products <ArrowRight size={15} />
                </Link>
            </div>
        </section>
    );
};

export default LatestProducts;