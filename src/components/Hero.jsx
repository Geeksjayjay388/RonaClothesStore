import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, UserRound, Heart, Home, Watch, Zap, MessageCircle, Store, Globe, PhoneCall } from "lucide-react";

const categories = [
    { label: "Men", to: "/store?cat=men", icon: UserRound },
    { label: "Women", to: "/store?cat=women", icon: Heart },
    { label: "Curtains", to: "/store?cat=curtains", icon: Home },
    { label: "Accessories", to: "/store?cat=accessories", icon: Watch },
    { label: "Sale", to: "/store?cat=sale", icon: Zap, accent: true },
];

const carouselSlides = [
    { image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=75&w=1600&h=900&fm=webp", label: "Footwear", tag: "Limited Edition" },
    { image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=75&w=1600&h=900&fm=webp", label: "Jackets", tag: "New Drop" },
    { image: "https://images.unsplash.com/photo-1630655107617-c8731a3ba3d6?auto=format&fit=crop&q=75&w=1600&h=900&fm=webp", label: "Curtains", tag: "Home Collection" },
    { image: "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?auto=format&fit=crop&q=75&w=1600&h=900&fm=webp", label: "Women's Wear", tag: "2026 Season" },
];

const Hero = () => {
    const [hoveredCat, setHoveredCat] = useState(null);
    const [current, setCurrent] = useState(0);
    const [loadedSlides, setLoadedSlides] = useState(() => new Set());

    useEffect(() => {
        carouselSlides.forEach((slide, index) => {
            const img = new Image();
            img.src = slide.image;
            img.onload = () => {
                setLoadedSlides((prev) => {
                    const next = new Set(prev);
                    next.add(index);
                    return next;
                });
            };
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrent((p) => (p + 1) % carouselSlides.length), 4500);
        return () => clearInterval(timer);
    }, []);

    const prev = useCallback(() => setCurrent((p) => (p - 1 + carouselSlides.length) % carouselSlides.length), []);
    const next = useCallback(() => setCurrent((p) => (p + 1) % carouselSlides.length), []);

    return (
        <section className="relative w-full overflow-hidden flex flex-col justify-center" style={{ minHeight: "85vh", backgroundColor: "#fdfdfd" }}>
            {/* Doodle pattern background - Light theme */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Floating panels — 3 Columns Jumia Style (Sharp Edges, White theme, Larger) */}
            <div className="relative z-10 flex items-stretch justify-center gap-6 px-4 md:px-8 lg:px-10 py-12 max-w-[1700px] mx-auto w-full">

                {/* ─── LEFT — Category Card (Col 1) ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="hidden md:flex flex-col shrink-0 bg-white shadow-2xl"
                    style={{ width: "260px" }}
                >
                    <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
                        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-gray-500">Shop By</p>
                    </div>
                    <ul className="flex flex-col py-3 flex-grow">
                        {categories.map((cat, i) => {
                            const Icon = cat.icon;
                            const isHovered = hoveredCat === i;
                            return (
                                <li key={cat.label}>
                                    <Link
                                        to={cat.to}
                                        onMouseEnter={() => setHoveredCat(i)}
                                        onMouseLeave={() => setHoveredCat(null)}
                                        className={`flex items-center justify-between gap-3 mx-3 px-4 py-3.5 border-l-2 transition-all duration-200
                                            ${isHovered ? "border-black bg-gray-50 text-black" : "border-transparent text-gray-600"}
                                            ${cat.accent && !isHovered ? "text-red-600 font-bold" : ""}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={16} className={`transition-colors ${isHovered ? "text-black" : "text-gray-400"}`} />
                                            <span className="font-black text-[13px] tracking-wide uppercase">{cat.label}</span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 mt-auto">
                        <Link to="/store" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
                            All Products →
                        </Link>
                    </div>
                </motion.div>

                {/* ─── CENTER — Carousel Card (Col 2) ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                    className="flex-1 relative overflow-hidden shadow-2xl bg-black"
                    style={{ height: "600px" }}
                >
                    {/* Slides */}
                    {!loadedSlides.has(current) && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={current}
                            src={carouselSlides[current].image}
                            alt={carouselSlides[current].label}
                            loading={current === 0 ? "eager" : "lazy"}
                            fetchPriority={current === 0 ? "high" : "auto"}
                            decoding="async"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Gradient Overlay for Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                    {/* Slide Info */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`info-${current}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bottom-12 left-12 max-w-lg"
                        >
                            <span className="inline-block bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg mb-4">
                                {carouselSlides[current].tag}
                            </span>
                            <p className="text-white font-black tracking-tight leading-none drop-shadow-2xl"
                                style={{ fontSize: "clamp(54px, 7vw, 96px)" }}>
                                {carouselSlides[current].label}
                            </p>
                            <Link to="/store" className="mt-8 inline-flex items-center gap-2 bg-white text-black px-9 py-4 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">
                                Shop Now <ChevronRight size={15} />
                            </Link>
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav Arrows */}
                    <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-105 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-105 transition-all">
                        <ChevronRight size={20} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-10 right-12 flex gap-2.5 items-center">
                        {carouselSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-300 ${i === current ? "w-10 h-1.5 bg-white" : "w-5 h-1.5 bg-white/40 hover:bg-white/80"}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* ─── RIGHT — Action Cards (Col 3) ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="hidden lg:flex flex-col gap-6 shrink-0"
                    style={{ width: "280px" }}
                >
                    {/* Top Card: Quick Links */}
                    <div className="bg-white p-7 shadow-2xl flex-1 flex flex-col justify-center">
                        <ul className="flex flex-col gap-6 h-full py-1">
                            <li>
                                <a href="https://wa.me/254711011011" target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-11 h-11 bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-black tracking-wide uppercase leading-tight">Order via<br />WhatsApp</p>
                                    </div>
                                </a>
                            </li>
                            <div className="h-px w-full bg-gray-100" />
                            <li>
                                <Link to="/worldwide" className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-11 h-11 bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-black tracking-wide uppercase leading-tight">Global<br />Shipping</p>
                                    </div>
                                </Link>
                            </li>
                            <div className="h-px w-full bg-gray-100" />
                            <li>
                                <Link to="/sell" className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-11 h-11 bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <Store size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-black tracking-wide uppercase leading-tight">Sell on<br />Rona</p>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Bottom Card: Promo Banner */}
                    <div className="bg-[#cc1111] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ minHeight: "220px" }}>
                        <div className="absolute top-5 right-5 opacity-[0.15]">
                            <PhoneCall size={70} className="text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-center">
                            <div>
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Support</p>
                                <p className="text-white font-black tracking-tighter leading-none mb-1" style={{ fontSize: "32px" }}>
                                    0711 011 011
                                </p>
                                <p className="text-white font-bold text-xs uppercase tracking-widest mt-2 drop-shadow-sm">Call to order</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile strip */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 flex overflow-x-auto gap-2 px-4 pb-5 no-scrollbar">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Link key={cat.label} to={cat.to}
                            className={`shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm
                                ${cat.accent ? "bg-red-600 text-white" : "bg-white text-gray-900"}`}>
                            <Icon size={12} /> {cat.label}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default Hero;
