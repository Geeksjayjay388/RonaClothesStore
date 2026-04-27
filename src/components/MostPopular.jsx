import { Link } from "react-router-dom";
import { Star, ArrowRight, Zap, TrendingUp } from "lucide-react";

const MostPopular = () => {
    return (
        <section className="py-24 relative overflow-hidden" style={{ background: "#0d0d0d" }}>
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "128px",
                }}
            />

            {/* Glow blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-10 relative z-10">

                {/* Section Label */}
                <div className="flex items-center gap-4 mb-10">
                    <TrendingUp size={16} className="text-red-500" />
                    <h2 className="text-[11px] font-black tracking-[0.35em] uppercase text-white/50">Most Popular</h2>
                    <div className="flex-1 h-px bg-white/10 max-w-[80px]" />
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ minHeight: "500px" }}>

                    {/* LEFT — Editorial dark block */}
                    <div
                        className="relative rounded-none overflow-hidden flex flex-col justify-end p-9 min-h-[420px]"
                        style={{ background: "linear-gradient(145deg, #111 0%, #1a1025 60%, #0d0d0d 100%)" }}
                    >
                        {/* Decorative border glow */}
                        <div className="absolute inset-0 rounded-none border border-white/6 pointer-events-none" />

                        {/* Background ghost text */}
                        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
                            <span className="font-black text-white/[0.03] leading-none text-center tracking-tighter"
                                style={{ fontSize: "clamp(80px, 14vw, 180px)", lineHeight: 0.85 }}>
                                POPU<br />LAR<br />SAFE
                            </span>
                        </div>

                        {/* Glow accents */}
                        <div className="absolute top-8 right-8 w-36 h-36 bg-cyan-400/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-16 left-8 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />

                        {/* Stacked editorial text */}
                        <div className="relative z-10">
                            <p className="font-black leading-[0.82] tracking-tighter mb-1"
                                style={{ fontSize: "clamp(50px, 7vw, 88px)", color: "#22d3c5", textShadow: "0 0 60px rgba(34,211,197,0.5)" }}>
                                Popu<span style={{ opacity: 0.5 }}>lar</span>
                            </p>
                            <p className="font-black leading-[0.82] tracking-tighter mb-6"
                                style={{ fontSize: "clamp(50px, 7vw, 88px)", color: "#f97316", textShadow: "0 0 60px rgba(249,115,22,0.5)" }}>
                                Safe Work
                            </p>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-white/8 border border-white/15 text-white/70 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full">
                                    The Report
                                </span>
                                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Edit</span>
                            </div>
                            <Link to="/store"
                                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl">
                                Shop The Edit <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT — Two stacked cards */}
                    <div className="flex flex-col gap-5">

                        {/* Top — Product Feature */}
                        <div className="flex-1 rounded-none overflow-hidden relative min-h-[220px] border border-white/8">
                            <img
                                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
                                alt="Featured"
                                className="w-full h-full object-cover opacity-90 scale-105 hover:scale-100 transition-transform duration-700"
                                style={{ minHeight: "220px" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                                <div>
                                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-0.5">Editor's Pick</p>
                                    <p className="text-white font-black text-xl tracking-tight leading-none">Essential Collection</p>
                                </div>
                                <Link to="/store"
                                    className="bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all shrink-0">
                                    Shop Now
                                </Link>
                            </div>
                        </div>

                        {/* Bottom — Members Promo */}
                        <div
                            className="rounded-none p-7 relative overflow-hidden border border-pink-400/20"
                            style={{ background: "linear-gradient(135deg, #be185d 0%, #9d174d 50%, #831843 100%)" }}
                        >
                            {/* Shine overlay */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl" />

                            <div className="relative z-10 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={13} className="fill-yellow-300 text-yellow-300" />
                                        ))}
                                    </div>
                                    <p className="text-white font-black text-sm uppercase tracking-[0.1em] leading-snug mb-4 max-w-[200px]">
                                        Members' Exclusive — 30% Off all accessories. Limited time.
                                    </p>
                                    <Link to="/signup"
                                        className="inline-flex items-center gap-2 bg-white text-pink-700 text-[11px] font-black uppercase tracking-[0.18em] px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition-all shadow-lg">
                                        <Zap size={12} /> Join Now
                                    </Link>
                                </div>
                                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                                    <Star size={22} className="fill-white text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MostPopular;
