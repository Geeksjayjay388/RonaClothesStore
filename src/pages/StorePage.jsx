import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { Search, ShoppingBag, Eye, Loader2, X, MessageSquare } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import ProductPreviewModal from "../components/ProductPreviewModal";

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [previewProduct, setPreviewProduct] = useState(null);
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
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div
                                        className="bg-gray-100 aspect-square overflow-hidden relative cursor-pointer"
                                        onClick={() => setPreviewProduct(product)}
                                    >
                                        <img
                                            src={product.image_url || product.image}
                                            alt={product.name}
                                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out`}
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>

                                        {/* Status Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {product.is_out_of_stock && (
                                                <span className="bg-gray-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                                                    Sold Out
                                                </span>
                                            )}
                                            {product.on_offer && (
                                                <span className="bg-red-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                                                    Sale
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setPreviewProduct(product); }}
                                                className="bg-white/90 backdrop-blur-md text-gray-900 p-2 sm:p-3 rounded-full shadow-xl hover:bg-gray-900 hover:text-white transition-all"
                                                title="Quick View"
                                            >
                                                <Eye size={18} className="sm:w-5 sm:h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); orderOnWhatsApp(product); }}
                                                className="bg-white/90 backdrop-blur-md text-[#25D366] p-2 sm:p-3 rounded-full shadow-xl hover:bg-[#25D366] hover:text-white transition-all"
                                                title="Direct WhatsApp Order"
                                            >
                                                <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-6 flex flex-col flex-grow text-left">
                                        <div className="flex justify-between items-start mb-1 sm:mb-2">
                                            <p className="text-[10px] sm:text-xs text-red-500 font-bold uppercase tracking-widest">{product.category}</p>
                                            <div className="flex flex-col items-end">
                                                {product.on_offer && product.original_price && (
                                                    <span className="text-[10px] text-gray-400 line-through font-bold">{formatPrice(product.original_price)}</span>
                                                )}
                                                <p className="font-bold text-xs sm:text-base text-gray-900">{formatPrice(product.price)}</p>
                                            </div>
                                        </div>
                                        <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-grow line-clamp-2">{product.description}</p>

                                        <button
                                            onClick={() => !product.is_out_of_stock && addToCart(product)}
                                            disabled={product.is_out_of_stock}
                                            className={`w-full py-3 rounded-xl font-bold transition-colors border text-sm tracking-wide ${product.is_out_of_stock
                                                ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                                                : "bg-gray-50 text-gray-1000 py-3 rounded-xl font-bold hover:bg-gray-900 hover:text-white border-gray-200 hover:border-gray-900"
                                                }`}
                                        >
                                            {product.is_out_of_stock ? "Out of Stock" : "Add to Cart"}
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

            <ProductPreviewModal
                product={previewProduct}
                isOpen={!!previewProduct}
                onClose={() => setPreviewProduct(null)}
            />
        </div>
    );
};

export default StorePage;
