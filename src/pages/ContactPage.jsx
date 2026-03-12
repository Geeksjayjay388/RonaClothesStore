import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mail, MapPin, Instagram, Linkedin, Music2, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactBg from "../assets/contact-bg.png";

const TypewriterQuote = ({ quotes }) => {
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const currentQuote = quotes[index];
        let timeout;

        if (isTyping) {
            if (displayedText.length < currentQuote.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentQuote.slice(0, displayedText.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 3000);
            }
        } else {
            if (displayedText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, 30);
            } else {
                setIndex((prev) => (prev + 1) % quotes.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isTyping, index, quotes]);

    return (
        <div className="h-32 flex items-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-relaxed italic">
                "{displayedText}"
                <span className="w-1 h-8 bg-red-600 ml-1 inline-block animate-pulse align-middle" />
            </p>
        </div>
    );
};

const ContactPage = () => {
    const quotes = [
        "Style is a way to say who you are without having to speak.",
        "Elegance is not standing out, but being remembered.",
        "Quality is never an accident; it is always the result of effort.",
        "The Archive. A collection of timeless silhouettes."
    ];

    const whatsappNumber = "+25442424046";
    const openWhatsApp = () => {
        const message = encodeURIComponent("Hello RONA, I have an inquiry regarding your products.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
                {/* Left Side: Visual/Image */}
                <div className="hidden lg:block lg:w-1/2 relative h-auto overflow-hidden bg-gray-100">
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src={ContactBg}
                            alt="RONA Studio Aesthetic"
                            className="w-full h-full object-cover brightness-98"
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </motion.div>

                    {/* Floating Label atop image - Desktop Only */}
                    <div className="absolute bottom-12 left-12 z-10 hidden lg:block">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/20"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 block mb-1">Inspiration</span>
                            <p className="text-gray-900 font-bold italic tracking-tight text-lg">Curated for the Collective.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Contact Content */}
                <div className="lg:w-1/2 py-16 lg:py-24 px-6 lg:px-20 bg-white flex flex-col justify-center">
                    <div className="max-w-xl mx-auto w-full">
                        <header className="mb-12">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
                            >
                                Get In Touch
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4"
                            >
                                Let's Connect.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 font-bold uppercase tracking-widest text-xs"
                            >
                                Part of <span className="text-gray-200">The Archive.</span>
                            </motion.p>
                        </header>

                        {/* Animated Quotes Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-16 border-l-4 border-red-600 pl-8 py-2"
                        >
                            <TypewriterQuote quotes={quotes} />
                        </motion.div>

                        {/* Contact Details Grid */}
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="grid sm:grid-cols-2 gap-10"
                            >
                                <div className="space-y-3 cursor-pointer group" onClick={openWhatsApp}>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                            <MessageSquare size={16} />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp</h3>
                                    </div>
                                    <p className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors flex items-center gap-2">
                                        +254 424 24046
                                        <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                            <Mail size={16} />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</h3>
                                    </div>
                                    <p className="text-xl font-black text-gray-900">fancyrona2@gmail.com</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                            <MapPin size={16} />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Studio</h3>
                                    </div>
                                    <p className="text-xl font-black text-gray-900">Nairobi, Kenya</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600">Socials</h3>
                                    <div className="flex gap-4">
                                        {[
                                            { icon: Instagram, url: "https://www.instagram.com/ronaelementra?igsh=MWJ0dnQ0bjFtbmd4Zw==" },
                                            { icon: Music2, url: "https://www.tiktok.com/@ronagesora?_r=1&_t=ZS-94bbUykEdld" },
                                            { icon: Linkedin, url: "https://www.linkedin.com/in/rona-gesora-0614b4329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
                                        ].map((soc, i) => (
                                            <a key={i} href={soc.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                                <soc.icon size={18} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="pt-10 border-t border-gray-100 mt-4"
                            >
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    Our studio operates on a boutique model, focusing on limited releases and sustainable production. For custom inquiries or professional collaborations, please reach out via email.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
