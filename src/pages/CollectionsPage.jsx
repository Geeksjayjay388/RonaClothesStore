import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const collections = [
    {
        id: 1,
        title: "Summer Essentials",
        description: "Lightweight fabrics and vibrant colors for the perfect summer getaway.",
        image: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=1200",
        link: "/store?collection=summer",
        year: "2026",
    },
    {
        id: 2,
        title: "Autumn Lookbook",
        description: "Layer up with our premium knitwear and signature outerwear.",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200",
        link: "/store?collection=autumn",
        year: "2026",
    },
    {
        id: 3,
        title: "Minimalist Core",
        description: "The foundation of a versatile wardrobe. Neutral tones, perfect fits.",
        image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200",
        link: "/store?collection=minimalist",
        year: "CORE"
    }
];

const CollectionsPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#fafafa] text-gray-900">
            <Navbar />

            <main className="flex-grow pt-32 pb-32">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <header className="mb-24 md:mb-40 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                                The <br /> Edits<span className="text-indigo-600">.</span>
                            </h1>
                            <p className="text-xl text-gray-500 max-w-md">
                                A curated selection of our finest pieces, organized into distinct narratives for the contemporary wardrobe.
                            </p>
                        </div>
                        <div className="hidden md:block text-sm font-bold tracking-[0.2em] uppercase text-gray-400 rotate-90 origin-bottom-right translate-y-8">
                            Volume &mdash; 01
                        </div>
                    </header>

                    {/* Collections */}
                    <div className="space-y-32 md:space-y-48">
                        {collections.map((collection, index) => (
                            <div key={collection.id} className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Image Box */}
                                <div className="w-full md:w-3/5 group">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-200 shadow-sm transition-shadow hover:shadow-2xl hover:shadow-indigo-900/10">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                        <img
                                            src={collection.image}
                                            alt={collection.title}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                                        />
                                        <div className="absolute top-6 left-6 z-20 overflow-hidden">
                                            <span className="block text-white font-bold tracking-[0.2em] bg-black/30 backdrop-blur-md px-4 py-2 text-xs uppercase rounded-none">
                                                {collection.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Box */}
                                <div className="w-full md:w-2/5 flex flex-col justify-center">
                                    <span className="text-indigo-600 font-bold tracking-[0.2em] mb-6 text-sm uppercase flex items-center gap-4">
                                        <span className="w-12 h-px bg-indigo-200"></span> 0{index + 1} / 03
                                    </span>
                                    <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                                        {collection.title}
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                                        {collection.description}
                                    </p>

                                    <Link to={collection.link} className="inline-flex items-center gap-5 group/link w-fit">
                                        <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center group-hover/link:bg-indigo-600 group-hover/link:border-indigo-600 group-hover/link:text-white transition-all duration-300 shadow-sm">
                                            <ArrowUpRight className="w-6 h-6 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                        </div>
                                        <span className="text-lg font-bold border-b border-gray-900 pb-1 group-hover/link:text-indigo-600 group-hover/link:border-indigo-600 transition-colors uppercase tracking-widest text-sm">
                                            Discover Now
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CollectionsPage;