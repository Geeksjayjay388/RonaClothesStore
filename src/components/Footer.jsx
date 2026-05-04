import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import logoName from "../assets/logoName.png";

const TikTokIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-6 md:px-10 pt-16 pb-8">

                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-5">
                        <Link to="/" className="inline-block bg-white px-3 py-2 rounded-xl">
                            <img src={logoName} alt="RONA" className="h-8 object-contain" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                            Defining the segment of fashion apparel by fusing the future of aesthetics with uncompromising premium and high-concept workmanship.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://www.instagram.com/ronaelementra?igsh=MWJ0dnQ0bjFtbmd4Zw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="https://www.tiktok.com/@ronagesora?_r=1&_t=ZS-94bbUykEdld"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                            >
                                <TikTokIcon size={16} />
                            </a>
                            <a
                                href="https://www.facebook.com/people/Rona-Gesora/61586006600311/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                            >
                                <Facebook size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Shop Us */}
                    <div>
                        <h4 className="text-xs font-black tracking-[0.25em] uppercase mb-5 text-white">Shop Us</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Collections", to: "/store" },
                                { label: "New Arrivals", to: "/store?cat=new" },
                                { label: "Best Sellers", to: "/store" },
                                { label: "Sale", to: "/store?cat=sale" },
                            ].map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="text-gray-400 text-sm hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs font-black tracking-[0.25em] uppercase mb-5 text-white">Support</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "FAQ & Help", to: "/contact" },
                                { label: "Orders & Returns", to: "/contact" },
                                { label: "Size Guide", to: "/contact" },
                                { label: "Contact", to: "/contact" },
                            ].map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="text-gray-400 text-sm hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-black tracking-[0.25em] uppercase mb-5 text-white">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Terms of Service", to: "#" },
                                { label: "Privacy Policy", to: "#" },
                            ].map(({ label, to }) => (
                                <li key={label}>
                                    <a href={to} className="text-gray-400 text-sm hover:text-white transition-colors">{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
                    <p>&copy; {new Date().getFullYear()} RONA ELEMENTRA. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;