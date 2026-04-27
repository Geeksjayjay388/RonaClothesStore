import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

const stories = [
    {
        id: 1,
        category: "Style Guide",
        title: "Silhouettes: A Study in Black & White",
        excerpt: "Exploring the intersection of tailored silhouettes and modern styling in the most minimal palette possible.",
        date: "Apr 2026",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&h=500",
        accent: "#111",
    },
    {
        id: 2,
        category: "Editorial",
        title: "The Art of Sustainable Luxury",
        excerpt: "How we are rethinking materials to ensure the future of high fashion remains conscious.",
        date: "Mar 2026",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600&h=500",
        accent: "#1a0a0a",
    },
    {
        id: 3,
        category: "Behind the Brand",
        title: "Spring / Summer Backstage Pass",
        excerpt: "A raw, unfiltered look at the energy behind our season's biggest showcase.",
        date: "Mar 2026",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600&h=500",
        accent: "#0a0a1a",
    },
];

const LatestStories = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    opacity: 0.4,
                }}
            />

            <div className="container mx-auto px-6 md:px-10 relative z-10">

                {/* Header */}
                <div className="flex items-end justify-between mb-14">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <BookOpen size={15} className="text-gray-400" />
                            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-400">The Journal</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">
                            Latest Stories
                        </h2>
                    </div>
                    <Link to="/about"
                        className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-red-600 hover:border-red-600 transition-all">
                        View All <ArrowRight size={15} />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stories.map((story, i) => (
                        <article
                            key={story.id}
                            className="group relative flex flex-col rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-400 bg-white"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden" style={{ height: "260px" }}>
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                {/* Category pill */}
                                <span className="absolute top-4 left-4 bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-md">
                                    {story.category}
                                </span>

                                {/* Issue number watermark */}
                                <span className="absolute top-4 right-4 text-white/40 font-black text-xs tracking-widest">
                                    #{String(i + 1).padStart(2, "0")}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                                    {story.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-grow line-clamp-3">
                                    {story.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{story.date}</span>
                                    <Link to="/about"
                                        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">
                                        Read <ArrowRight size={11} />
                                    </Link>
                                </div>
                            </div>

                            {/* Bottom accent bar */}
                            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-600 to-pink-500 transition-all duration-500 ease-out" />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestStories;
