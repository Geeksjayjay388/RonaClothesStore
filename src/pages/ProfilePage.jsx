import React from "react";
import { User, MapPin, Package, Heart, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-12 pt-32">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900">My Account</h1>
                    <p className="text-gray-500 mt-2">Welcome back, Jacob. Here is your dashboard.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-2 sticky top-32">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold transition-colors">
                                <User size={20} />
                                Profile Details
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors">
                                <Package size={20} />
                                Orders
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors">
                                <MapPin size={20} />
                                Addresses
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors">
                                <Heart size={20} />
                                Wishlist
                            </button>
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors">
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-3/4 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
                                    <input type="text" defaultValue="Jacob" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
                                    <input type="text" defaultValue="Sihul" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                                    <input type="email" defaultValue="jacob.sihul@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
