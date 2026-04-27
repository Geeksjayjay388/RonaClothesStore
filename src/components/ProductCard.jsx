import React from 'react';
import { ShoppingBag, Eye, MessageSquare } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart, orderOnWhatsApp } = useCart();

    return (
        <div
            className="group flex flex-col bg-white overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2 transition-all duration-500 rounded-3xl relative"
            style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.04)", background: "linear-gradient(145deg, #ffffff, #fafafa)" }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden cursor-pointer bg-gray-100 aspect-[4/5] rounded-t-3xl">
                <img
                    src={product.image_url || product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <span className="bg-white/95 backdrop-blur-md shadow-sm text-gray-900 border border-gray-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        New
                    </span>
                    {product.is_out_of_stock && (
                        <span className="bg-gray-900/95 backdrop-blur-md shadow-sm text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Sold Out
                        </span>
                    )}
                    {product.on_offer && (
                        <span className="bg-red-600/95 backdrop-blur-md shadow-sm text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Sale
                        </span>
                    )}
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-6 transition-all duration-500 ease-out z-10">
                    <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="bg-white text-gray-900 p-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 flex-1 flex justify-center"
                        title="Add to Cart"
                    >
                        <ShoppingBag size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); orderOnWhatsApp(product); }}
                        className="bg-white text-[#25D366] p-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-[#25D366] hover:text-white hover:scale-105 transition-all duration-300"
                        title="WhatsApp Order"
                    >
                        <MessageSquare size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                        className="bg-white text-gray-900 p-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
                        title="Quick View"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-10 bg-transparent">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">{product.category}</p>
                    <div className="text-right">
                        {product.on_offer && product.original_price && (
                            <span className="text-[10px] text-gray-400 line-through font-bold block leading-none mb-1">
                                {formatPrice(product.original_price)}
                            </span>
                        )}
                        <span className="font-black text-[15px] sm:text-[17px] text-gray-900 leading-none tracking-tight">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {product.name}
                </h3>

                {/* Sizes */}
                <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                    {(product.sizes?.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).slice(0, 4).map((size) => (
                        <span key={size} className="text-[10px] font-bold border border-gray-100 bg-gray-50 px-2 py-1 rounded text-gray-500 group-hover:border-gray-200 transition-colors">
                            {size}
                        </span>
                    ))}
                    {(product.sizes?.length > 4) && <span className="text-[10px] font-bold text-gray-400 px-1 py-1 flex items-center">+</span>}
                </div>

                <div className="w-full h-px bg-gray-100 mb-5" />

                <button
                    onClick={(e) => { e.stopPropagation(); !product.is_out_of_stock && addToCart(product); }}
                    disabled={product.is_out_of_stock}
                    className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 ${product.is_out_of_stock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/30"
                        }`}
                >
                    {product.is_out_of_stock ? "Sold Out" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
