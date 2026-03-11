import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, Search, Menu } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const location = useLocation();
    const { cartCount } = useCart();
    const { user, isAdmin } = useAuth();

    // Helper to style active links
    const navLinkClass = (path) =>
        `text-sm font-bold tracking-widest uppercase transition-all duration-300 ${location.pathname === path || (path === '/admin' && location.pathname.startsWith('/admin')) ? "text-indigo-600" : "text-gray-900 hover:text-indigo-600"
        }`;

    return (
        <nav
            className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        >
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">

                {/* Mobile Menu Icon (Hidden on Desktop) */}
                <button className="lg:hidden text-gray-900">
                    <Menu size={24} />
                </button>

                {/* Logo - Centered on mobile, Left on Desktop */}
                <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-1">
                    <span className="bg-gray-900 text-white px-2 py-0.5 rounded">RONA</span>
                    <span>ELEMENTRA</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-10 items-center">
                    <Link to="/" className={navLinkClass("/")}>Home</Link>
                    <Link to="/store" className={navLinkClass("/store")}>Store</Link>
                    <Link to="/collections" className={navLinkClass("/collections")}>Collections</Link>
                    <Link to="/about" className={navLinkClass("/about")}>Our Story</Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={`${navLinkClass("/admin")} bg-indigo-50 px-4 py-2 rounded-full text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-all flex items-center gap-2`}
                        >
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
                            Admin
                        </Link>
                    )}
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-4 sm:gap-6 text-gray-900">
                    <div className="hidden lg:flex items-center gap-6">
                        <Link to="/store" className="hover:text-indigo-600 transition-colors">
                            <Search size={20} />
                        </Link>

                        {user ? (
                            <Link to="/profile" className="flex items-center gap-2 hover:text-indigo-600 transition-colors group">
                                <span className="text-sm font-bold tracking-tight text-gray-700 group-hover:text-indigo-600">
                                    {user.user_metadata?.first_name || "Profile"}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                                    <User size={18} />
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-gray-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300">
                                    Join
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className="relative hover:text-indigo-600 transition-colors">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button className="lg:hidden text-gray-900 hover:text-indigo-600 transition-colors">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;