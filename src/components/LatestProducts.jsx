import { ShoppingBag, Eye } from "lucide-react"; // Optional: if you use lucide-react icons

const LatestProducts = () => {
    const products = [
        { id: 1, name: "Classic T-Shirt", price: "$29.99", category: "Essentials", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Denim Jacket", price: "$89.99", category: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-0c1444ba22c0?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Slim Fit Jeans", price: "$59.99", category: "Denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400" },
        { id: 4, name: "Sneakers", price: "$119.99", category: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-left">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Latest Arrivals
                        </h2>
                        <p className="text-gray-500 max-w-md">
                            The pieces everyone is talking about. Freshly dropped and ready for your wardrobe.
                        </p>
                    </div>
                    <button className="hidden md:block text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-800 hover:border-indigo-800 transition-all">
                        View All Products
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            {/* Image Container */}
                            <div className="bg-gray-100 aspect-square overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>

                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <button className="bg-white text-gray-900 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-indigo-600 hover:text-white">
                                        <ShoppingBag size={20} />
                                    </button>
                                    <button className="bg-white text-gray-900 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-indigo-600 hover:text-white">
                                        <Eye size={20} />
                                    </button>
                                </div>

                                {/* Badge */}
                                <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                    New
                                </span>
                            </div>

                            {/* Product Info */}
                            <div className="p-6 flex flex-col flex-grow text-left">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{product.category}</p>
                                    <p className="font-bold text-gray-900">{product.price}</p>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 flex-grow">{product.description || "Everyday comfort with premium materials."}</p>

                                <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-colors border border-gray-200 hover:border-gray-900 text-sm tracking-wide">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile-only view all button */}
                <button className="md:hidden mt-10 w-full py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-900">
                    View All Products
                </button>
            </div>
        </section>
    );
};

export default LatestProducts;