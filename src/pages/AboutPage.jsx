import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Navbar />
            <main className="flex-grow pt-20">
                {/* Hero */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
                        alt="About Us"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white px-6">
                        <span className="font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Our Story</span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Designed to Last.</h1>
                    </div>
                </section>

                {/* Content */}
                <section className="py-24">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="prose prose-lg md:prose-xl mx-auto text-gray-700 space-y-8">
                            <p className="lead text-2xl font-medium text-gray-900">
                                RONA ELEMENTRA was born from a simple belief: clothing should be an effortless extension of yourself, not a disposable commodity.
                            </p>
                            <p>
                                Founded in 2026, we set out to disrupt the fast-fashion narrative by creating timeless silhouettes constructed from peerless materials. We believe in the beauty of simplicity and the power of exceptional craftsmanship.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Sustainable Practices</h3>
                                    <p className="text-base">We trace every thread back to its source, partnering only with mills and factories that share our militant commitment to environmental stewardship and fair labor.</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Radical Transparency</h3>
                                    <p className="text-base">We pull back the curtain on our supply chain. You know exactly what it costs to make our garments, and exactly why they are priced the way they are.</p>
                                </div>
                            </div>
                            <p>
                                Every piece we design is intended to be worn, loved, and passed down. This isn't just fashion; it's a foundation for living. Welcome to the RONA ELEMENTRA family.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
