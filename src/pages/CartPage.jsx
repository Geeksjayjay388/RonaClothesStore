import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../lib/formatters";
import { MessageSquare, ArrowRight, X, Minus, Plus, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
    const { cartItems, updateQuantity, removeItem, checkoutToWhatsApp } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 md:px-8 py-12 pt-28 md:pt-36">
                {/* Minimalist Header */}
                <header className="mb-12 md:mb-20">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4 lowercase">your bag.</h1>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                        <span>{cartItems.length} Items</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <Link to="/store" className="hover:text-black transition-colors">Continue Shopping</Link>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Items List - Ultra Minimal */}
                    <div className="flex-grow">
                        <AnimatePresence mode="popLayout">
                            {cartItems.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 text-center"
                                >
                                    <p className="text-xl font-medium text-gray-400 mb-8">Your bag is empty.</p>
                                    <Link to="/store" className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition-all">
                                        Go to store
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <motion.div 
                                            key={`${item.id}-${item.size || "nosize"}`}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="py-8 first:pt-0 flex gap-6 md:gap-10 relative group"
                                        >
                                            {/* Image - Sleek & Simple */}
                                            <div className="w-24 h-32 md:w-32 md:h-44 bg-gray-50 overflow-hidden shrink-0">
                                                <img 
                                                    src={item.image_url || item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg md:text-2xl font-black tracking-tight leading-tight mb-1">{item.name}</h3>
                                                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
                                                            {item.size ? `Size: ${item.size}` : "One Size"}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="text-gray-300 hover:text-black transition-colors"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>

                                                <div className="flex items-end justify-between mt-6">
                                                    {/* Clean Quantity Picker */}
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center border-b border-gray-200">
                                                            <button onClick={() => updateQuantity(item.id, -1, item.size)} className="p-2 text-gray-400 hover:text-black"><Minus size={14} /></button>
                                                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1, item.size)} className="p-2 text-gray-400 hover:text-black"><Plus size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-lg md:text-2xl font-black tracking-tighter">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary - Integrated Layout */}
                    <div className="w-full lg:w-[350px] shrink-0">
                        <div className="lg:sticky lg:top-40 space-y-10">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-widest mb-8">Summary</h2>
                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-black font-bold">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-black font-bold">Free</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">Total</span>
                                        <span className="text-3xl font-black tracking-tighter">{formatPrice(subtotal)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Button */}
                            <button
                                onClick={checkoutToWhatsApp}
                                disabled={cartItems.length === 0}
                                className="hidden md:flex w-full bg-black text-white py-5 rounded-none font-black uppercase tracking-[0.3em] text-[10px] items-center justify-center gap-3 hover:bg-red-600 transition-all disabled:opacity-20"
                            >
                                <MessageSquare size={16} />
                                Checkout to WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Footer - Action Oriented */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[150] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Amount</p>
                                <p className="text-xl font-black tracking-tighter">{formatPrice(subtotal)}</p>
                            </div>
                            <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                Free Shipping
                            </div>
                        </div>
                        <button
                            onClick={checkoutToWhatsApp}
                            className="w-full bg-black text-white py-4 rounded-none font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                        >
                            <MessageSquare size={16} />
                            Order on WhatsApp
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="md:block hidden">
                <Footer />
            </div>
            {/* Space for mobile footer */}
            <div className="h-32 md:hidden" />
        </div>
    );
};

export default CartPage;
