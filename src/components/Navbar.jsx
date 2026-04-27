import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { ShoppingCart, User, Search, Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../lib/formatters";
import logoName from "../assets/logoName.png";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Search State
    const [searchOpen, setSearchOpen] = useState(false); // Mobile search input visibility
    const [searchVal, setSearchVal] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // Desktop dropdown visibility

    const { cartCount } = useCart();
    const { user, isAdmin, signOut, profile } = useAuth();

    useEffect(() => { setIsOpen(false); }, [location]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    // Live search query effect
    useEffect(() => {
        const fetchResults = async () => {
            if (!searchVal.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            try {
                const { data } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('name', `%${searchVal}%`)
                    .limit(5);
                if (data) setSearchResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchVal]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchVal.trim()) {
            setShowDropdown(false);
            setSearchOpen(false); // Handle mobile
            navigate(`/store?search=${encodeURIComponent(searchVal)}`);
        }
    };

    const isActive = (path) => {
        if (path === "/store") {
            return location.pathname === "/store" && !location.search.includes("cat=new");
        }
        if (path === "/store?cat=new") {
            return location.pathname === "/store" && location.search.includes("cat=new");
        }
        return location.pathname === path || (path === "/admin" && location.pathname.startsWith("/admin"));
    };

    return (
        <>
            {/* Announcement Bar */}
            <div className="w-full bg-black text-white text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-center py-2.5 px-4 z-[110] relative">
                Gesture, gift &amp; exclusive glamour this season — free shipping on orders over KES 5,000
            </div>

            <nav className="sticky top-0 w-full z-[100] bg-white border-b border-gray-200 shadow-sm">
                <div className="mx-auto px-4 md:px-8 h-16 md:h-[68px] flex items-center justify-between gap-4">

                    {/* LEFT — Logo */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img src={logoName} alt="RONA" className="h-7 md:h-9 object-contain" />
                    </Link>

                    {/* CENTER — Search (desktop) */}
                    <div className="hidden md:flex flex-1 max-w-[400px] mx-6 relative">
                        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search collections..."
                            value={searchVal}
                            onChange={e => {
                                setSearchVal(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            onKeyDown={handleSearchSubmit}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 rounded-full border border-transparent focus:border-gray-300 focus:bg-white focus:shadow-lg focus:outline-none transition-all"
                        />

                        {/* Search Dropdown Desktop */}
                        <AnimatePresence>
                            {showDropdown && searchVal.trim() && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-[120%] left-0 right-0 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden flex flex-col py-2 z-[200]"
                                >
                                    {isSearching ? (
                                        <div className="flex items-center justify-center p-6">
                                            <Loader2 size={24} className="animate-spin text-gray-400" />
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Suggested Products</span>
                                            </div>
                                            <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                                                {searchResults.map(prod => (
                                                    <div
                                                        key={prod.id}
                                                        onMouseDown={() => { navigate(`/product/${prod.id}`); setShowDropdown(false); setSearchVal(""); }}
                                                        className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <img src={prod.image_url || prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-gray-900 truncate">{prod.name}</h4>
                                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{prod.category}</p>
                                                        </div>
                                                        <div className="text-sm font-black text-gray-900">
                                                            {formatPrice(prod.price)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div
                                                onMouseDown={() => { navigate(`/store?search=${encodeURIComponent(searchVal)}`); setShowDropdown(false); }}
                                                className="mt-2 mx-3 mb-1 p-3 text-center bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors cursor-pointer"
                                            >
                                                View All Results
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-6 text-center flex flex-col items-center gap-2">
                                            <span className="text-2xl">👀</span>
                                            <span className="text-gray-500 text-sm font-medium">No matches found for "{searchVal}"</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT — Nav links + Icons */}
                    <div className="hidden md:flex items-center gap-6 shrink-0 z-50">
                        <Link to="/" className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${isActive("/") ? "text-red-600" : "text-gray-900 hover:text-red-600"}`}>Home</Link>
                        <Link to="/store" className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${isActive("/store") ? "text-red-600" : "text-gray-900 hover:text-red-600"}`}>Collections</Link>
                        <Link to="/store?cat=new" className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${isActive("/store?cat=new") ? "text-red-600" : "text-gray-900 hover:text-red-600"}`}>New Arrivals</Link>
                        <Link to="/about" className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${isActive("/about") ? "text-red-600" : "text-gray-900 hover:text-red-600"}`}>Our Story</Link>
                        <Link to="/sell" className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${isActive("/sell") ? "text-red-600" : "text-gray-900 hover:text-red-600"}`}>Sell on Rona</Link>
                        {isAdmin && (
                            <Link to="/admin" className="text-[11px] font-semibold tracking-[0.14em] uppercase text-red-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>Admin
                            </Link>
                        )}

                        <div className="flex items-center gap-4 ml-2 text-gray-800">
                            <Link to="/cart" className="relative hover:text-red-600 transition-colors">
                                <ShoppingCart size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            {user ? (
                                <Link to="/profile" className="flex items-center gap-2 lg:gap-3 bg-transparent lg:bg-gray-50 lg:border lg:border-gray-200 rounded-full lg:pl-3 lg:pr-1 lg:py-1 hover:border-red-300 hover:shadow-md hover:shadow-red-500/10 transition-all group">
                                    <div className="hidden lg:flex items-center gap-1.5 pl-1">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-red-500 transition-colors">Hi,</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-900 truncate max-w-[80px]">
                                            {profile?.first_name || "User"}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 lg:w-7 lg:h-7 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-200 lg:border-transparent group-hover:border-red-200 transition-colors shrink-0 shadow-sm">
                                        {profile?.avatar_url ? (
                                            <img src={`${profile.avatar_url}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={14} className="text-gray-700" />
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-900 hover:text-red-600 transition-colors">
                                        Log In
                                    </Link>
                                    <span className="text-gray-300 hidden lg:block">|</span>
                                    <Link to="/signup" className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-900 hover:text-red-600 transition-colors hidden lg:block">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Right Icons */}
                    <div className="flex md:hidden items-center gap-3 text-gray-800 z-50">
                        <button onClick={() => setSearchOpen(s => !s)} className="p-1.5 hover:text-red-600 transition-colors">
                            <Search size={20} />
                        </button>
                        <Link to="/cart" className="relative p-1.5 hover:text-red-600 transition-colors">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(true)} className="p-1.5 hover:text-red-600 transition-colors">
                            <Menu size={22} />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar & Dropdown */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t border-gray-100 bg-white px-4 py-3 shadow-md absolute w-full left-0 z-[200]"
                        >
                            <div className="relative">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search collections..."
                                    value={searchVal}
                                    onChange={e => setSearchVal(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-100 rounded-full border border-transparent focus:border-gray-300 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Mobile Dropdown Results */}
                            {searchVal.trim() && (
                                <div className="mt-4 flex flex-col gap-2">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-6 text-gray-400">
                                            <Loader2 size={24} className="animate-spin" />
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            <div className="max-h-[50vh] overflow-y-auto no-scrollbar pb-2">
                                                {searchResults.map(prod => (
                                                    <div
                                                        key={prod.id}
                                                        onMouseDown={() => { navigate(`/product/${prod.id}`); setSearchOpen(false); setSearchVal(""); }}
                                                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mb-2"
                                                    >
                                                        <img src={prod.image_url || prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-bold text-gray-900 truncate">{prod.name}</h4>
                                                        </div>
                                                        <div className="text-xs font-black text-gray-900 pr-2">
                                                            {formatPrice(prod.price)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div
                                                onMouseDown={() => { navigate(`/store?search=${encodeURIComponent(searchVal)}`); setSearchOpen(false); }}
                                                className="py-3 text-center bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest mt-1"
                                            >
                                                See All Results
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-6 text-center text-gray-500 text-xs font-medium border border-gray-100 rounded-xl bg-gray-50">
                                            No matches found
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Drawer */}
            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] md:hidden">
                            <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                                className="absolute top-0 left-0 bottom-0 w-[82%] max-w-sm bg-white shadow-2xl flex flex-col"
                            >
                                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                    <img src={logoName} alt="RONA" className="h-8 object-contain" />
                                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={20} /></button>
                                </div>
                                <div className="flex-grow overflow-y-auto py-8 px-6 flex flex-col gap-6">
                                    {[
                                        { to: "/", label: "Home" },
                                        { to: "/store", label: "Collections" },
                                        { to: "/store?cat=new", label: "New Arrivals" },
                                        { to: "/about", label: "Our Story" },
                                        { to: "/sell", label: "Sell on Rona" },
                                        { to: "/contact", label: "Contact" },
                                    ].map(({ to, label }) => (
                                        <Link key={to} to={to} className={`text-2xl font-black lowercase tracking-tighter hover:text-red-600 transition-colors ${isActive(to) ? "text-red-600" : "text-gray-900"}`}>{label}</Link>
                                    ))}
                                    {isAdmin && <Link to="/admin" className="text-2xl font-black text-red-600 lowercase tracking-tighter">Admin</Link>}
                                </div>
                                <div className="px-6 pb-8 pt-4 border-t border-gray-100">
                                    {user ? (
                                        <div className="flex flex-col gap-4">
                                            <Link to="/profile" className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 p-3 rounded-2xl hover:bg-gray-50 hover:border-red-100 transition-colors group">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 overflow-hidden shrink-0 shadow-sm group-hover:border-red-200 transition-colors">
                                                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-red-500 mb-0.5">Welcome Back</span>
                                                    <span className="text-sm font-black tracking-widest uppercase text-gray-900">
                                                        {profile?.first_name || "User"}
                                                    </span>
                                                </div>
                                            </Link>
                                            <button onClick={() => signOut()} className="w-full py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors text-left">Sign Out</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link to="/login" className="w-full py-3.5 bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs text-center">Login</Link>
                                            <Link to="/signup" className="w-full py-3.5 border-2 border-gray-200 text-gray-900 rounded-xl font-black uppercase tracking-widest text-xs text-center">Join</Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default Navbar;
