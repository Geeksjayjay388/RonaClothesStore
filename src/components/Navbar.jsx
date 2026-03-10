import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, Search, Menu } from "lucide-react"; // Install lucide-react if you haven't!

const Navbar = () => {
    const location = useLocation();

    // Helper to style active links
    const navLinkClass = (path) =>
        `text-sm font-bold tracking-widest uppercase transition-all duration-300 ${location.pathname === path ? "text-indigo-600" : "text-gray-900 hover:text-indigo-600"
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
                <div className="hidden lg:flex gap-10">
                    <Link to="/" className={navLinkClass("/")}>Home</Link>
                    <Link to="/store" className={navLinkClass("/store")}>Store</Link>
                    <Link to="/collections" className={navLinkClass("/collections")}>Collections</Link>
                    <Link to="/about" className={navLinkClass("/about")}>Our Story</Link>
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-6 text-gray-900">
                    <button className="hover:text-indigo-600 transition-colors hidden sm:block">
                        <Search size={20} />
                    </button>
                    <Link to="/profile" className="hover:text-indigo-600 transition-colors hidden sm:block">
                        <User size={20} />
                    </Link>
                    <Link to="/cart" className="relative hover:text-indigo-600 transition-colors">
                        <ShoppingCart size={20} />
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            2
                        </span>
                    </Link>
                    <button className="md:hidden text-gray-900 hover:text-indigo-600 transition-colors">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;