import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCollections = async () => {
        try {
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCollections(data || []);
        } catch (error) {
            console.error("Error fetching collections:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();

        const channel = supabase
            .channel('store-collections-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, () => {
                fetchCollections();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                {/* --- GRAPHIC HEADER (Matching Store Style) --- */}
                <section className="relative min-h-[45vh] flex items-center bg-gray-900 border-b border-gray-800 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
                            alt="Background texture"
                            className="w-full h-full object-cover opacity-20 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    </div>

                    {/* Massive Background Watermark */}
                    <h1 className="absolute -bottom-10 -right-10 text-[18vw] font-black text-white/5 tracking-tighter z-10 select-none">
                        EDITS.
                    </h1>

                    <div className="container mx-auto px-6 lg:px-8 relative z-20 mt-12 text-left">
                        <div className="max-w-3xl">
                            <span className="inline-block text-red-400 font-bold tracking-[0.4em] uppercase text-xs mb-4">
                                Curated Series
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                                The <span className="text-red-500">Archive.</span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                                Explore our series of curated edits, ranging from seasonal essentials to our permanent minimalist core collection.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- COLLECTIONS GRID (Matching Card Style) --- */}
                <div className="container mx-auto px-4 lg:px-8 py-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-gray-900 mb-4" size={48} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Unveiling the archive...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {collections.length === 0 ? (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-xl text-gray-500 font-medium lowercase">No collections curated yet.</p>
                                </div>
                            ) : (
                                collections.map((collection) => (
                                    <div key={collection.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">

                                        {/* Image Container */}
                                        <div className="bg-gray-100 aspect-[4/5] overflow-hidden relative">
                                            <img
                                                src={collection.image_url || collection.image}
                                                alt={collection.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                            />
                                            {/* Subtle Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500"></div>

                                            {/* Floating Tag */}
                                            <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
                                                {collection.tag}
                                            </span>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-8 flex flex-col flex-grow text-left">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Layers size={14} className="text-red-500" />
                                                <p className="text-xs text-red-500 font-bold uppercase tracking-widest lowercase">
                                                    Series {collection.id.toString().slice(-2)}
                                                </p>
                                            </div>

                                            <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-red-600 transition-colors tracking-tight">
                                                {collection.title}
                                            </h3>

                                            <p className="text-gray-500 leading-relaxed mb-8 flex-grow line-clamp-3">
                                                {collection.description}
                                            </p>

                                            <Link
                                                to={collection.link || `/store?collection=${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="inline-flex items-center justify-between w-full group/btn bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-red-600 shadow-lg hover:shadow-red-200"
                                            >
                                                <span className="tracking-wide">View Collection</span>
                                                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollectionsPage;