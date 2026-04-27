import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingCart, MessageSquare, ChevronLeft, ChevronRight, Share2, ArrowLeft } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, orderOnWhatsApp } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const availableSizes = product?.sizes && product.sizes.length > 0
        ? product.sizes
        : ["S", "M", "L", "XL"];

    useEffect(() => {
        if (product && !selectedSize && availableSizes.length > 0) {
            setSelectedSize(availableSizes[0]); // default to first size
        }
    }, [product, availableSizes]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-xl font-black text-gray-900 mb-4">Product Not Found</p>
                    <button onClick={() => navigate("/store")} className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-black transition-colors">
                        Return to Store
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0
        ? product.images
        : (product.image_url ? [product.image_url] : ["https://placehold.co/800x800/f3f4f6/4b5563?text=No+Image"]);

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1">
                {/* Product Detail Area */}
                <div className="container mx-auto px-6 md:px-10 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Image Gallery (Left) */}
                    <div className="lg:w-1/2 flex flex-col gap-6">
                        <button onClick={() => navigate(-1)} className="self-start flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-2">
                            <ArrowLeft size={16} /> Back
                        </button>

                        <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={allImages[currentImageIndex]}
                                    alt={`${product.name} view ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Tags */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                {product.is_out_of_stock && (
                                    <span className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Sold Out</span>
                                )}
                                {product.on_offer && (
                                    <span className="bg-red-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Sale</span>
                                )}
                            </div>

                            {/* Nav Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md flex items-center justify-center text-black hover:bg-white transition-all shadow-md">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md flex items-center justify-center text-black hover:bg-white transition-all shadow-md">
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-20 h-24 shrink-0 overflow-hidden transition-all filter ${currentImageIndex === idx ? "grayscale-0 ring-2 ring-black ring-offset-2" : "grayscale opacity-60 hover:opacity-100 hover:grayscale-0"}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info (Right) */}
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-none tracking-tighter mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-3xl font-black text-black">{formatPrice(product.price)}</span>
                            {product.on_offer && product.original_price && (
                                <span className="text-lg text-gray-400 line-through font-bold">{formatPrice(product.original_price)}</span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-600 mb-10 leading-relaxed">
                            <p>{product.description || "Everyday comfort with premium materials. Crafted meticulously for those who demand the finest in contemporary fashion. This piece embodies the brutalist elegance that defines our latest collection."}</p>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Size</h4>
                                <button className="text-[10px] font-black uppercase tracking-widest text-black underline">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[60px] h-14 flex items-center justify-center border font-black text-sm uppercase tracking-widest transition-all
                                            ${selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => !product.is_out_of_stock && addToCart(product, selectedSize)}
                                disabled={product.is_out_of_stock}
                                className={`w-full py-5 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3
                                    ${product.is_out_of_stock
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                        : "bg-black text-white hover:bg-gray-900 border border-black shadow-2xl"
                                    }`}
                            >
                                {product.is_out_of_stock ? "Out of Stock" : <><ShoppingCart size={18} /> Add to Cart</>}
                            </button>

                            {orderOnWhatsApp && !product.is_out_of_stock && (
                                <button
                                    onClick={() => orderOnWhatsApp(product, selectedSize)}
                                    className="w-full bg-[#25D366] text-white py-5 font-black uppercase tracking-widest text-sm hover:bg-[#1ebd5b] transition-colors flex items-center justify-center gap-3 shadow-2xl"
                                >
                                    <MessageSquare size={18} /> Order via WhatsApp
                                </button>
                            )}
                        </div>

                        {/* Extra Details */}
                        <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-8">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Shipping</span>
                                <span className="text-sm font-bold text-gray-900">Free over $200</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Returns</span>
                                <span className="text-sm font-bold text-gray-900">Within 30 Days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductPage;
