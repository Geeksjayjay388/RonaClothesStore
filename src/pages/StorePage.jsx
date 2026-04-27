import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

const StorePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const isNewArrival = searchParams.get("cat") === "new";

    useEffect(() => {
        // Sync url param if we navigate with search param
        if (searchParams.get("search") !== null) {
            setSearch(searchParams.get("search") || "");
        }
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        const channel = supabase
            .channel('store-products-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);

        // Update URL to match search string
        if (val) {
            searchParams.set("search", val);
        } else {
            searchParams.delete("search");
        }
        setSearchParams(searchParams, { replace: true });
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === "All" ||
            product.category?.toLowerCase() === selectedCategory.toLowerCase();

        let matchesNew = true;
        if (isNewArrival) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const productDate = new Date(product.created_at || new Date());
            matchesNew = productDate >= oneWeekAgo;
        }

        return matchesSearch && matchesCategory && matchesNew;
    });

    const categories = ["All", "Clothes", "Curtains", "Bags", "Dress"];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#fafafa]">
            <Navbar />
            <main className="flex-grow">
                {/* Graphic Header */}
                <section className="relative min-h-[40vh] flex items-center bg-gray-900 border-b border-gray-800 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
                            alt="Background texture"
                            className="w-full h-full object-cover opacity-20 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                    </div>

                    <h1 className="absolute -bottom-10 -right-10 text-[18vw] font-black text-white/5 tracking-tighter z-10 select-none pointer-events-none">
                        STORE.
                    </h1>

                    <div className="container mx-auto px-6 lg:px-10 relative z-20 mt-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-xl text-left">
                                <span className="inline-block text-red-500 font-black tracking-[0.4em] uppercase text-xs mb-4">
                                    {isNewArrival ? "Recently Added" : "Full Catalog"}
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                    {isNewArrival ? (
                                        <>New <span className="text-red-500">Arrivals.</span></>
                                    ) : (
                                        <>Shop <span className="text-red-500">All.</span></>
                                    )}
                                </h1>
                            </div>

                            <div className="max-w-md w-full relative z-30">
                                <input
                                    type="text"
                                    placeholder="Search the collection..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="w-full px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-red-500 focus:bg-white/15 focus:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all text-lg backdrop-blur-md placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="mt-12 flex flex-wrap gap-3 overflow-x-auto pb-4 no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${selectedCategory === cat
                                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/30 -translate-y-1"
                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white hover:bg-white/10 hover:-translate-y-1"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 lg:px-10 py-16 md:py-24">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="animate-spin text-gray-900 mb-6" size={48} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Curating your store...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <span className="text-3xl">📭</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No Items Found</h3>
                                    <p className="text-base text-gray-500 font-medium max-w-md">We couldn't find any products matching "{search}". Try checking your spelling or exploring other categories.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StorePage;
