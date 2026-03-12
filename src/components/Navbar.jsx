import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { ShoppingBag, ShoppingCart, User, Search, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logoName from "../assets/logoName.png";

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, isAdmin, signOut, profile } = useAuth();

    // Close mobile menu on location change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Disable scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    // Helper to style active links
    const navLinkClass = (path) =>
        `text-sm font-bold tracking-widest uppercase transition-all duration-300 ${location.pathname === path || (path === '/admin' && location.pathname.startsWith('/admin')) ? "text-red-600" : "text-gray-900 hover:text-red-600"
        }`;

    return (
        <nav
            className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        >
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">

                {/* Mobile Menu Icon (Hidden on Desktop) */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden -ml-2 p-2 text-gray-900 hover:text-red-600 transition-colors cursor-pointer"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>

                {/* Logo - Centered on mobile, Left on Desktop */}
                <Link to="/" className="flex items-center">
                    <img src={logoName} alt="RONA ELEMENTRA" className="h-8 sm:h-10 object-contain" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-10 items-center">
                    <Link to="/" className={navLinkClass("/")}>Home</Link>
                    <Link to="/store" className={navLinkClass("/store")}>Store</Link>
                    <Link to="/about" className={navLinkClass("/about")}>Our Story</Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={`${navLinkClass("/admin")} bg-pink-50 px-4 py-2 rounded-full text-red-600 hover:bg-pink-100 border border-pink-100 transition-all flex items-center gap-2`}
                        >
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                            Admin
                        </Link>
                    )}
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-4 sm:gap-6 text-gray-900">
                    <div className="hidden lg:flex items-center gap-6">
                        <Link to="/store" className="hover:text-red-600 transition-colors">
                            <Search size={20} />
                        </Link>

                        {user ? (
                            <Link to="/profile" className="flex items-center gap-2 hover:text-red-600 transition-colors group">
                                <span className="text-sm font-bold tracking-tight text-gray-700 group-hover:text-red-600">
                                    {profile?.first_name || user.user_metadata?.first_name || "Profile"}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-pink-200 group-hover:bg-pink-50 transition-all overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} />
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-gray-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all duration-300">
                                    Join
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className="relative hover:text-red-600 transition-colors">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* --- MOBILE OVERLAY --- */}
                {typeof document !== 'undefined' && createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[200] lg:hidden"
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                            >
                                {/* Backdrop */}
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                                />

                                {/* Drawer */}
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="absolute top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white shadow-2xl flex flex-col h-full"
                                >
                                    <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                                        <Link to="/" className="flex items-center">
                                            <img src={logoName} alt="RONA ELEMENTRA" className="h-8 object-contain" />
                                        </Link>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-grow overflow-y-auto py-8 px-6 space-y-6">
                                        <div className="flex flex-col gap-6">
                                            <Link to="/" className="text-2xl font-black text-gray-900 lowercase tracking-tighter hover:text-red-600 transition-colors">Home</Link>
                                            <Link to="/store" className="text-2xl font-black text-gray-900 lowercase tracking-tighter hover:text-red-600 transition-colors">Store</Link>
                                            <Link to="/about" className="text-2xl font-black text-gray-900 lowercase tracking-tighter hover:text-red-600 transition-colors">Our Story</Link>
                                            {isAdmin && (
                                                <Link to="/admin" className="text-2xl font-black text-red-600 lowercase tracking-tighter">Admin Dashboard</Link>
                                            )}
                                        </div>

                                        <div className="pt-8 border-t border-gray-100 mt-8 space-y-6">
                                            {user ? (
                                                <>
                                                    <Link to="/profile" className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                                                                {profile?.avatar_url ? (
                                                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User size={20} />
                                                                )}
                                                            </div>
                                                            <span className="font-bold text-gray-900">{profile?.first_name || user.user_metadata?.first_name || "Account"}</span>
                                                        </div>
                                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                                                    </Link>
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="w-full py-4 text-center font-bold text-gray-400 hover:text-red-600 transition-colors text-sm uppercase tracking-widest"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    <Link to="/login" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs text-center">Login</Link>
                                                    <Link to="/signup" className="w-full py-4 border-2 border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs text-center">Join The Collective</Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </nav>
    );
};

export default Navbar;