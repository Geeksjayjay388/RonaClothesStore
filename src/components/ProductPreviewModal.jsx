import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../lib/formatters';
import { useCart } from '../context/CartContext';

const ProductPreviewModal = ({ product, isOpen, onClose }) => {
    if (!product || !isOpen) return null;

    const { addToCart, orderOnWhatsApp } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Combine legacy image_url with new images array, fallback to a placeholder if none
    const allImages = product.images && product.images.length > 0
        ? product.images
        : (product.image_url ? [product.image_url] : ["https://placehold.co/600x600/f3f4f6/4b5563?text=No+Image"]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row max-h-[90vh] custom-scrollbar"
                    >
                        {/* Close button - Desktop */}
                        <button
                            onClick={onClose}
                            className="hidden md:flex absolute top-6 right-6 z-20 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full items-center justify-center hover:bg-white text-gray-900 transition-colors shadow-sm cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Gallery Section */}
                        <div className="md:w-1/2 bg-gray-50 flex flex-col relative h-[40vh] md:h-auto">
                            {/* Close button - Mobile */}
                            <button
                                onClick={onClose}
                                className="md:hidden absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-gray-900 transition-colors shadow-sm cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            {/* Main Image */}
                            <div className="flex-grow relative h-full flex items-center justify-center p-4">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        src={allImages[currentImageIndex]}
                                        alt={`${product.name} - view ${currentImageIndex + 1}`}
                                        className={`w-full h-full object-contain drop-shadow-xl max-h-[500px]`}
                                    />
                                </AnimatePresence>

                                {/* Modal Status Badges */}
                                <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                                    {product.is_out_of_stock && (
                                        <span className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                                            Sold Out
                                        </span>
                                    )}
                                    {product.on_offer && (
                                        <span className="bg-red-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                                            Special Offer
                                        </span>
                                    )}
                                </div>

                                {/* Navigation Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all shadow-md cursor-pointer"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all shadow-md cursor-pointer"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="h-24 bg-white border-t border-gray-100 flex items-center gap-3 px-6 overflow-x-auto custom-scrollbar flex-shrink-0">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer ${currentImageIndex === idx ? 'ring-2 ring-red-600 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2 p-6 md:p-10 flex flex-col md:max-h-none md:overflow-y-auto custom-scrollbar">
                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {product.category}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h2>

                            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                {product.on_offer && product.original_price && (
                                    <span className="text-sm text-gray-400 line-through font-bold">{formatPrice(product.original_price)}</span>
                                )}
                            </div>

                            <div className="flex-grow mb-8">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description</h4>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    {product.description || "Everyday comfort with premium materials. Crafted meticulously for those who demand the finest in contemporary fashion."}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <button
                                    onClick={() => !product.is_out_of_stock && addToCart(product)}
                                    disabled={product.is_out_of_stock}
                                    className={`w-full py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${product.is_out_of_stock
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                        : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                                        }`}
                                >
                                    {product.is_out_of_stock ? "Sold Out" : <><ShoppingCart size={18} /> Add to Cart</>}
                                </button>

                                {orderOnWhatsApp && !product.is_out_of_stock && (
                                    <button
                                        onClick={() => orderOnWhatsApp(product)}
                                        className="w-full bg-emerald-500 text-white py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={18} />
                                        Order on WhatsApp
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductPreviewModal;
