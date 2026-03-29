import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { TrendingUp, Sparkles, ShoppingBag } from "lucide-react";
import HeroImage from "../assets/hero.png";

const phrases = [
    "New Season Arrival",
    "Limited Edition Drops",
    "Premium Quality",
    "Everyday Essentials"
];

const Hero = () => {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [highlightedProducts, setHighlightedProducts] = useState([]);

    useEffect(() => {
        const fetchHighlights = async () => {
            const { data } = await supabase
                .from('products')
                .select('name')
                .eq('is_highlighted', true)
                .limit(3);
            if (data) setHighlightedProducts(data);
        };
        fetchHighlights();

        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 3000); // Change text every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center overflow-hidden bg-gray-50">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: fit-content;
                    animation: marquee 30s linear infinite;
                }
            `}</style>

            <div className="relative flex-grow w-full flex items-center justify-center">
                {/* Background Layer with Gradient Overlay for Better Contrast */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center md:bg-right bg-no-repeat"
                        style={{ backgroundImage: `url(${HeroImage})` }}
                    />
                    {/* Gradient overlay to ensure text is always readable */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:from-white/90 md:via-white/50" />
                </div>

                <div className="container mx-auto px-6 md:px-13 z-10 relative pb-12 lg:pb-32 pt-20 lg:pt-0">
                    <div className="max-w-2xl text-left relative">
                        {/* Decorative element */}
                        <div className="absolute -left-6 -top-6 w-20 h-20 bg-red-500/10 rounded-full blur-2xl"></div>

                        <div className="inline-flex items-center gap-3 text-red-600 font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 text-[10px] md:text-sm relative z-10 h-6">
                            <span className="w-6 md:w-8 h-px bg-red-600"></span>
                            <div className="relative w-64 overflow-hidden h-full">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={phraseIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="absolute inset-0 flex items-center"
                                    >
                                        {phrases[phraseIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-6 leading-[1.15] md:leading-[1.1] tracking-tight text-gray-900 relative z-10">
                            Elevate Your <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                                Signature Style.
                            </span>
                        </h1>

                        <p className="text-base md:text-2xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-xl font-medium relative z-10">
                            Experience the fusion of comfort and high-fashion. Our curated 2026 collection is designed for those who <i className="text-gray-900 font-bold">lead</i>, not follow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                            <Link
                                to="/store"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-red-600 px-10 py-4 font-bold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                <span className="relative">Shop Store</span>
                            </Link>

                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center px-10 py-4 rounded-full font-bold text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
                            >
                                Our Story
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Banner - Moved below content and styled Black & White */}
            <div className="w-full bg-black text-white py-4 relative z-[60] mt-0 overflow-hidden border-y border-white/10">
                <div className="flex whitespace-nowrap animate-marquee items-center gap-12 px-6">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                            <TrendingUp size={14} />
                            <span>Exclusive Sales live now</span>
                            <Sparkles size={14} />
                            {highlightedProducts.length > 0 ? (
                                <span>Featured: {highlightedProducts.map(p => p.name).join(" • ")}</span>
                            ) : (
                                <span>Premium Drop 2026</span>
                            )}
                            <ShoppingBag size={14} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

};

export default Hero;