import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const PrivacyBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('rona-p-choice');
        if (!consent) {
            // Wait 5 seconds before showing
            const timer = setTimeout(() => {
                setShouldRender(true);
                setIsVisible(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('rona-p-choice', 'a-all');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('rona-p-choice', 'e-only');
        setIsVisible(false);
    };

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[380px] z-[9999]"
                >
                    <div className="bg-white border border-gray-100 p-8 shadow-2xl rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex gap-5 items-start mb-8">
                                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Cookie size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Cookie Preferences
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        We use cookies to enhance your experience and keep your session secure while you shop.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 py-3.5 bg-gray-900 hover:bg-red-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
                                >
                                    Accept All
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
                                >
                                    Essential
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PrivacyBanner;
