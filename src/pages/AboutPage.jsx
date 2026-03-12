import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ownerImage from "../assets/image.png";
import logoName from "../assets/logoName.png";

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white selection:bg-black selection:text-white">
            <Navbar />

            <main className="flex-grow pt-20">
                {/* Minimalist Hero */}
                <section className="relative h-[50vh] flex items-center justify-center bg-gray-50 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0"></div>
                    <div className="relative z-10 text-center px-6">
                        <span className="text-[10px] tracking-[0.5em] uppercase text-gray-500 mb-6 block animate-fade-in">Est. 2026</span>
                        <img
                            src={logoName}
                            alt="Rona Elementra"
                            className="h-16 md:h-24 mx-auto object-contain brightness-0"
                        />
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-24">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                            {/* Left Text Column */}
                            <div className="lg:col-span-7 space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-3xl md:text-5xl font-black text-black leading-[1.1] tracking-tighter uppercase">
                                        Clothing as an <br />
                                        <span className="text-gray-400">effortless extension</span> <br />
                                        of the self.
                                    </h2>
                                    <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                        RONA ELEMENTRA was born from a refusal to accept the temporary. We create silhouettes that ignore trends in favor of permanence.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-100">
                                    <div className="group">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3 group-hover:text-red-600 transition-colors">Stewardship</h3>
                                        <p className="text-sm text-gray-500 leading-6">Tracing every thread back to its source. We partner with mills that share a militant commitment to the environment.</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3 group-hover:text-red-600 transition-colors">Radical Logic</h3>
                                        <p className="text-sm text-gray-500 leading-6">Transparency isn't a marketing buzzword; it's our foundation. High-performance materials, justified pricing.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Image Column (The Owner) */}
                            <div className="lg:col-span-5 sticky top-32">
                                <div className="relative group">
                                    {/* Geometric accent */}
                                    <div className="absolute -inset-4 border border-gray-100 -z-10 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>

                                    <div className="aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm">
                                        <img
                                            src={ownerImage}
                                            alt="Founder of Rona Elementra"
                                            className="w-full h-full object-cover scale-[1.01] hover:scale-110 transition-transform duration-[2s] ease-out"
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400">Founder & Creative Director</p>
                                        <p className="text-sm font-bold text-black uppercase mt-1">Rona Gesora</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;