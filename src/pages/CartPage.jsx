import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Classic T-Shirt",
            color: "White",
            size: "M",
            price: 29.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 2,
            name: "Denim Jacket",
            color: "Blue Wash",
            size: "L",
            price: 89.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1551028719-0c1444ba22c0?auto=format&fit=crop&q=80&w=200"
        }
    ]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 5.00;
    const total = subtotal + (cartItems.length > 0 ? shipping : 0);

    const updateQuantity = (id, delta) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-12 pt-12">
                <h1 className="text-4xl font-black text-gray-900 mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        {cartItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <p className="text-xl text-gray-500 mb-6 font-medium">Your cart is empty.</p>
                                <Link to="/store" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                    <div className="w-full sm:w-32 h-40 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-grow justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{item.color} | SIZE {item.size}</p>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-4 sm:mt-0">
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-bold hover:bg-white rounded transition-colors">-</button>
                                                <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-bold hover:bg-white rounded transition-colors">+</button>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" aria-label="Remove item">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-32">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8 text-gray-600 font-medium">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Estimated Shipping</span>
                                    <span className="font-bold text-gray-900">${cartItems.length > 0 ? shipping.toFixed(2) : "0.00"}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-6 mt-4 flex justify-between items-end">
                                    <div>
                                        <span className="text-lg font-bold text-gray-900 block">Total</span>
                                        <span className="text-xs text-gray-400">Including Taxes</span>
                                    </div>
                                    <span className="text-4xl font-black text-gray-900 tracking-tight">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                disabled={cartItems.length === 0}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="mt-6 text-center">
                                <Link to="/store" className="text-indigo-600 font-bold hover:underline">
                                    Continue Shopping
                                </Link>
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
