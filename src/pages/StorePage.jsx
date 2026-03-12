import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { Search, ShoppingBag, Eye, Loader2, X, MessageSquare } from "lucide-react";
import { formatPrice } from "../lib/formatters";

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { addToCart, orderOnWhatsApp } = useCart();

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        const channel = supabase
            .channel('store-products-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const filteredProducts = products.filter(product =>
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
                                <span className="inline-block text-red-400 font-bold tracking-[0.4em] uppercase text-xs mb-4">
                                    Full Catalog
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                    Shop <span className="text-red-500">All.</span>
                                </h1>
                            </div>

                            <div className="max-w-md w-full relative z-30">
                                <input
                                    type="text"
                                    placeholder="Search the collection..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all text-lg backdrop-blur-sm placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 lg:px-8 py-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-gray-900 mb-4" size={48} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Curating your store...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="bg-gray-100 aspect-square overflow-hidden relative">
                                        <img
                                            src={product.image_url || product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>

                                        {/* Quick Order WhatsApp Overlay */}
                                        <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => orderOnWhatsApp(product)}
                                                className="bg-white/90 backdrop-blur-md text-[#25D366] p-3 rounded-full shadow-xl hover:bg-[#25D366] hover:text-white transition-all"
                                                title="Direct WhatsApp Order"
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow text-left">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{product.category}</p>
                                            <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-2">{product.description}</p>

                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-colors border border-gray-200 hover:border-gray-900 text-sm tracking-wide"
                                        >
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
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StorePage;
