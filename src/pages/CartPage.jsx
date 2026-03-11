import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const CartPage = () => {
    const { cartItems, updateQuantity, removeItem } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + (cartItems.length > 0 ? shipping : 0);


    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 lg:px-12 py-12 pt-32 mb-24">
                <header className="mb-16 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">Your Cart.</h1>
                        <p className="text-gray-500 mt-4 font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag.</p>
                    </div>
                    <Link to="/store" className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500 border-b border-transparent hover:text-red-600 hover:border-red-600 transition-all pb-1">
                        Continue Shopping
                    </Link>
                </header>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Cart Items List */}
                    <div className="w-full lg:w-3/5">
                        {cartItems.length === 0 ? (
                            <div className="py-24 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                <p className="text-2xl font-bold text-gray-400 mb-6">Your bag is completely empty.</p>
                                <Link to="/store" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-red-600 transition-colors tracking-wide">
                                    Discover The Collection <ArrowRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="group flex gap-8 pb-10 border-b border-gray-100 last:border-0 relative">

                                        {/* Image */}
                                        <div className="w-32 h-44 sm:w-40 sm:h-52 bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex flex-col justify-between flex-grow py-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                                                    <div className="flex gap-4 mt-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                                                        <span>{item.color}</span>
                                                        <span className="w-px h-4 bg-gray-300"></span>
                                                        <span>Size: {item.size}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-6">
                                                <div className="flex items-center border border-gray-200 rounded-full">
                                                    <button onClick={() => updateQuantity(item.id, -1, item.size, item.color)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-full transition-colors">-</button>
                                                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1, item.size, item.color)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-full transition-colors">+</button>
                                                </div>
                                                <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sticky Sidebar */}
                    <div className="w-full lg:w-2/5">
                        <div className="bg-gray-50 rounded-3xl p-8 sm:p-10 sticky top-32">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Summary.</h2>

                            <div className="space-y-6 mb-8 text-gray-600 font-medium">
                                <div className="flex justify-between items-center text-lg">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span>Shipping</span>
                                    <span className="font-bold text-gray-900">{cartItems.length > 0 ? formatPrice(shipping) : formatPrice(0)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-6 mt-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">{formatPrice(total)}</span>
                                    </div>
                                    <p className="text-right text-xs text-gray-400 mt-2 font-bold tracking-widest uppercase">Taxes included</p>
                                </div>
                            </div>

                            <button
                                disabled={cartItems.length === 0}
                                className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:bg-black group shadow-xl shadow-black/10"
                            >
                                Secure Checkout
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Free Returns</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
