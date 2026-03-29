import React, { useState, useEffect } from "react";
import { ShoppingBag, Eye, ArrowRight, Loader2, MessageSquare } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import ProductPreviewModal from "./ProductPreviewModal";

const LatestProducts = () => {
    const { addToCart, orderOnWhatsApp } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewProduct, setPreviewProduct] = useState(null);

    const fetchLatest = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching latest products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatest();

        const channel = supabase
            .channel('latest-products-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchLatest();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-left">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Latest Arrivals
                        </h2>
                        <p className="text-gray-500 max-w-md">
                            The pieces everyone is talking about. Freshly dropped and ready for your wardrobe.
                        </p>
                    </div>
                    <button className="hidden md:block text-red-600 font-bold border-b-2 border-red-600 pb-1 hover:text-red-800 hover:border-red-800 transition-all">
                        View All Products
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-gray-900 mb-4" size={32} />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Updating catalog...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-400 font-medium">New pieces coming soon.</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                {/* Image Container */}
                                <div
                                    className="bg-gray-100 aspect-square overflow-hidden relative cursor-pointer"
                                    onClick={() => setPreviewProduct(product)}
                                >
                                    <img
                                        src={product.image_url || product.image}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105`}
                                    />

                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>

                                    {/* Hover Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-red-600 hover:text-white" title="Add to Cart">
                                            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); orderOnWhatsApp(product); }} className="bg-white text-[#25D366] p-2 sm:p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-[#25D366] hover:text-white" title="Order on WhatsApp">
                                            <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setPreviewProduct(product); }} className="bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150 hover:bg-red-600 hover:text-white" title="Quick View">
                                            <Eye size={18} className="sm:w-5 sm:h-5" />
                                        </button>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                            New
                                        </span>
                                        {product.is_out_of_stock && (
                                            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                Sold Out
                                            </span>
                                        )}
                                        {product.on_offer && (
                                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                Sale
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Product Info */}
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

                                    {/* Size Display on Card */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).slice(0, 4).map((size) => (
                                            <span key={size} className="text-[9px] font-black border border-gray-100 px-1.5 py-0.5 rounded-md text-gray-400 bg-gray-50/50">
                                                {size}
                                            </span>
                                        ))}
                                        {(product.sizes || []).length > 4 && <span className="text-[9px] font-black text-gray-300">...</span>}
                                    </div>

                                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-grow line-clamp-2">{product.description || "Everyday comfort with premium materials."}</p>

                                    <button
                                        onClick={() => !product.is_out_of_stock && addToCart(product)}
                                        disabled={product.is_out_of_stock}
                                        className={`w-full py-3 rounded-xl font-bold transition-colors border text-sm tracking-wide ${product.is_out_of_stock
                                            ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                                            : "bg-gray-50 text-gray-900 hover:bg-gray-900 hover:text-white border-gray-200 hover:border-gray-900"
                                            }`}
                                    >
                                        {product.is_out_of_stock ? "Out of Stock" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Mobile-only view all button */}
                <button className="md:hidden mt-10 w-full py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-900">
                    View All Products
                </button>
            </div>

            <ProductPreviewModal
                product={previewProduct}
                isOpen={!!previewProduct}
                onClose={() => setPreviewProduct(null)}
            />
        </section>
    );
};

export default LatestProducts;