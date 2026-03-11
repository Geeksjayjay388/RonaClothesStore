import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, ArrowRight, Send } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#0f1115] text-white">
            {/* Graphic Newsletter Section */}
            <div className="relative py-24 overflow-hidden border-b border-white/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/5 select-none tracking-tighter z-0 pointer-events-none">
                    SUBSCRIBE.
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <span className="text-red-400 font-bold tracking-[0.3em] uppercase text-xs mb-3">The Loop</span>
                    <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-10 max-w-2xl">
                        Unlock <span className="text-red-500">Early Access</span> & 10% Off.
                    </h3>

                    <div className="relative w-full max-w-md">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <button className="absolute right-2 top-2 bg-red-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-red-700 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-1">
                            <span className="bg-white text-black px-2 py-0.5 rounded">RONA</span>
                            <span>ELEMENTRA</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            Redefining everyday essentials with a focus on sustainable quality and timeless silhouettes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Shop</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link to="/store" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/store?cat=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/store?cat=sale" className="hover:text-white transition-colors">Sale</Link></li>
                            <li><Link to="/lookbook" className="hover:text-white transition-colors">Lookbook</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} CLO.THES Studio. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;