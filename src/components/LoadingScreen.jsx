import React from "react";
import { motion } from "framer-motion";
import logoName from "../assets/logoName.png";

const LoadingScreen = () => {
    const dotVariants = {
        animate: (i) => ({
            y: [0, -15, 0],
            opacity: [0.3, 1, 0.3],
            transition: {
                delay: i * 0.2,
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 bg-white p-2 rounded-xl"
            >
                <img src={logoName} alt="RONA" className="h-12 md:h-16 object-contain" />
            </motion.div>

            <div className="flex gap-3 mb-8">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        variants={dotVariants}
                        animate="animate"
                        custom={i}
                        className="w-4 h-4 rounded-full bg-red-600"
                    />
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                    Accessing The Archive
                </p>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
