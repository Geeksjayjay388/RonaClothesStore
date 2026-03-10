import { Star, Quote, CheckCircle } from "lucide-react";

const Reviews = () => {
    const reviews = [
        { id: 1, name: "Sarah M.", text: "The quality of the linen is unmatched. I’ve washed this shirt three times and it still looks and feels brand new. Truly premium.", rating: 5 },
        { id: 2, name: "John D.", text: "Finally found a brand that understands fit for taller guys. The Denim Jacket is structured but incredibly comfortable.", rating: 5 },
        { id: 3, name: "Emily R.", text: "The delivery was surprisingly fast, and the packaging felt like a gift to myself. The sneakers are now my daily go-to.", rating: 5 },
    ];

    return (
        <section className="py-24 bg-gray-50/50 border-y border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-16 text-center">
                    <span className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-xs mb-3">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        The Community Voice.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {reviews.map((review) => (
                        <div 
                            key={review.id} 
                            className="relative bg-white p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 group"
                        >
                            {/* Accent Quote Icon */}
                            <Quote className="absolute top-8 right-10 text-gray-100 group-hover:text-indigo-50 transition-colors" size={48} />
                            
                            <div className="relative z-10">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={`${i < review.rating ? "fill-indigo-600 text-indigo-600" : "text-gray-200"}`} 
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 text-lg leading-relaxed mb-8 min-h-[100px]">
                                    "{review.text}"
                                </p>

                                <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                                            {review.name}
                                        </p>
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <CheckCircle size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Buyer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 font-medium italic">
                        Join over <span className="text-gray-900 font-bold">10,000+</span> stylish individuals worldwide.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Reviews;