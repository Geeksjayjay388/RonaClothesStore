import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Search, UserPlus, CreditCard, Package, Layers, LayoutDashboard, PlusCircle, MoreVertical, Save, Image as ImageIcon, Eye, EyeOff, X, ArrowLeft, Loader2, ChevronRight, TrendingUp, ShoppingBag } from "lucide-react";
import { formatPrice } from "../lib/formatters";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const { profile } = useAuth();

    // Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("product");
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        image_url: "",
        images: [], // Existing image URLs
        imageFiles: [], // New local files to upload
        is_out_of_stock: false,
        on_offer: false,
        is_highlighted: false,
        original_price: "",
        sizes: "", // New: comma-separated sizes
    });

    useEffect(() => {
        fetchData();

        // Set up Realtime subscriptions
        const productsChannel = supabase
            .channel('admin-products-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Products fetch error:", error);
                toast.error("Products table fetch error");
            } else if (data) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const table = "products";

        try {
            let uploadedUrls = [...(formData.images || [])];
            let primaryImageUrl = formData.image_url;

            // Handle new image uploads if there are any
            if (formData.imageFiles && formData.imageFiles.length > 0) {
                toast.loading("Uploading images...", { id: 'upload-toast' });

                for (const file of formData.imageFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                    const { error: uploadError, data } = await supabase.storage
                        .from('product-images')
                        .upload(fileName, file, { cacheControl: '3600', upsert: false });

                    if (uploadError) {
                        toast.error(`Upload failed: ${file.name}`);
                        console.error("Storage upload error:", uploadError);
                        continue;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(fileName);

                    uploadedUrls.push(publicUrl);
                }

                toast.dismiss('upload-toast');

                // If it's the first time adding images, set the primary image
                if (!primaryImageUrl && uploadedUrls.length > 0) {
                    primaryImageUrl = uploadedUrls[0];
                }
            }

            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                image_url: primaryImageUrl || (uploadedUrls.length > 0 ? uploadedUrls[0] : ""),
                images: uploadedUrls,
                is_out_of_stock: formData.is_out_of_stock,
                on_offer: formData.on_offer,
                is_highlighted: formData.is_highlighted,
                original_price: formData.on_offer ? parseFloat(formData.original_price) : null,
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
            };

            let error;
            if (editItem) {
                const res = await supabase.from(table).update(payload).eq('id', editItem.id);
                error = res.error;
            } else {
                const res = await supabase.from(table).insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            toast.success(`${modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} saved successfully!`);
            setIsModalOpen(false);
            setEditItem(null);
            setFormData({ name: "", price: "", description: "", category: "", image_url: "", images: [], imageFiles: [], sizes: "" });
            setCategoryFilter("All"); // Reset filter to show new item
            fetchData();
        } catch (error) {
            toast.dismiss('upload-toast');
            toast.error(error.message || "Error saving item");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, table) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        setLoading(true);
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            toast.success("Item deleted successfully");
            fetchData();
        } catch (error) {
            toast.error(error.message || "Error deleting item");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (item, mode) => {
        setModalMode(mode);
        setEditItem(item);
        setFormData({
            name: item.name || "",
            price: item.price || "",
            description: item.description || "",
            category: item.category || "",
            image_url: item.image_url || "",
            images: item.images || [],
            imageFiles: [],
            is_out_of_stock: item.is_out_of_stock || false,
            on_offer: item.on_offer || false,
            is_highlighted: item.is_highlighted || false,
            original_price: item.original_price || "",
            sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : "",
        });
        setIsModalOpen(true);
    };

    const sidebarItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "products", label: "Products", icon: Package },
    ];

    const stats = [
        { label: "Inventory", value: products.length, icon: Package, trend: `+${products.length}`, color: "red" },
        { label: "Retail Value", value: formatPrice(products.reduce((acc, p) => acc + parseFloat(p.price), 0)), icon: CreditCard, trend: "Live", color: "red" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Navbar />

            <main className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* --- SIDEBAR --- */}
                        <aside className="w-full lg:w-64 flex flex-col gap-4 text-left">
                            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hidden lg:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-100 overflow-hidden shrink-0">
                                        {profile?.avatar_url ? (
                                            <img
                                                src={`${profile.avatar_url}?t=${new Date().getTime()}`}
                                                alt="Admin"
                                                className="w-full h-full object-cover"
                                                onError={(e) => console.error("Admin Dashboard: Profile image failed:", profile.avatar_url)}
                                            />
                                        ) : (
                                            <span className="text-white font-black text-xl">{profile?.first_name?.[0] || "A"}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <h3 className="font-black text-gray-900 leading-none truncate">{profile?.first_name} {profile?.last_name}</h3>
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Archive Admin</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-3xl p-3 shadow-sm">
                                <nav className="space-y-1">
                                    {sidebarItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                                    ? "bg-gray-900 text-white shadow-lg"
                                                    : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                                                    }`}
                                            >
                                                <Icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"} />
                                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="bg-red-600 rounded-3xl p-6 shadow-xl shadow-red-100 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-black text-lg mb-1 italic">Pro Features</h4>
                                    <p className="text-sm text-red-100 mb-4 font-medium">Connect Shop to Meta Catalog and TikTok.</p>
                                    <button className="w-full py-2.5 bg-white text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                                        Upgrade
                                    </button>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </aside>

                        {/* --- CONTENT AREA --- */}
                        <section className="flex-grow space-y-8">

                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 lowercase">
                                        {activeTab}<span className="text-red-600">.</span>
                                    </h1>
                                    <p className="text-gray-500 font-medium text-sm mt-1">Manage your storefront products.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {activeTab === "products" && (
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Filter by category..."
                                                    value={categoryFilter === "All" ? "" : categoryFilter}
                                                    onChange={(e) => setCategoryFilter(e.target.value || "All")}
                                                    className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-red-500 transition-all shadow-sm w-48"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setModalMode("product");
                                                    setEditItem(null);
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-100 text-sm whitespace-nowrap"
                                            >
                                                <Plus size={18} />
                                                <span>Add Product</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === "overview" && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {stats.map((stat, i) => (
                                                <div key={i} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                                            <stat.icon size={20} />
                                                        </div>
                                                        <span className="text-xs font-black text-emerald-500">{stat.trend}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recent Activity / Placeholder Chart */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h3 className="text-lg font-black uppercase tracking-widest text-gray-900">Sales Velocity</h3>
                                                    <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none">
                                                        <option>Last 7 Days</option>
                                                        <option>Last 30 Days</option>
                                                    </select>
                                                </div>
                                                <div className="h-64 flex items-end gap-3 pb-2">
                                                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                                        <div key={i} className="flex-grow group relative">
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${h}%` }}
                                                                transition={{ delay: i * 0.1, duration: 1 }}
                                                                className="bg-pink-50 border-x border-t border-pink-100 rounded-t-lg group-hover:bg-red-600 transition-colors"
                                                            />
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                {formatPrice(h * 12)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                                </div>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                                                <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-6">Store Health</h3>
                                                <div className="space-y-6">
                                                    {[
                                                        { label: "Inventory", value: "Optimal", color: "red", score: 98 },
                                                        { label: "Delivery", value: "Delayed", color: "pink", score: 72 },
                                                        { label: "Satisfaction", value: "Excellent", color: "red", score: 95 },
                                                    ].map((item, i) => (
                                                        <div key={i}>
                                                            <div className="flex justify-between items-end mb-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                                                                <span className={`text-xs font-bold text-${item.color}-600`}>{item.value}</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${item.score}%` }}
                                                                    className={`h-full bg-${item.color}-500`}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "products" && (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
                                    >
                                        <div className="hidden lg:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Preview</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Details</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right" style={{ width: '120px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {products.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium">
                                                                No products found. Click 'Add Product' to create one.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        products
                                                            .filter(p => categoryFilter === "All" || p.category?.toLowerCase() === categoryFilter.toLowerCase())
                                                            .map((product) => (
                                                                <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                                                    <td className="px-8 py-4">
                                                                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden">
                                                                            <img
                                                                                src={product.image_url || product.image}
                                                                                alt={product.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate max-w-[200px]">{product.name}</h4>
                                                                        <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                                                                        <div className="flex flex-wrap gap-1 mt-1 transition-opacity opacity-70">
                                                                            {Array.isArray(product.sizes) && product.sizes.map(size => (
                                                                                <span key={size} className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 font-bold">{size}</span>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <span className="font-bold text-gray-900">
                                                                            {formatPrice(product.price)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex flex-col gap-1">
                                                                            {product.is_out_of_stock && (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                                                                    Out of Stock
                                                                                </span>
                                                                            )}
                                                                            {product.is_highlighted && (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest">
                                                                                    Highlighted
                                                                                </span>
                                                                            )}
                                                                            {product.on_offer && (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                                                    Offer
                                                                                </span>
                                                                            )}
                                                                            {!product.is_out_of_stock && !product.on_offer && (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                                                    Active
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4 text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button
                                                                                onClick={() => openEditModal(product, "product")}
                                                                                className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-100"
                                                                                title="Edit"
                                                                            >
                                                                                <Edit2 size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(product.id, "products")}
                                                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100"
                                                                                title="Delete"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="lg:hidden divide-y divide-gray-50">
                                            {products.length === 0 ? (
                                                <div className="px-8 py-12 text-center text-gray-400 font-medium">
                                                    No products found. Click 'Add Product' to create one.
                                                </div>
                                            ) : (
                                                products
                                                    .filter(p => categoryFilter === "All" || p.category?.toLowerCase() === categoryFilter.toLowerCase())
                                                    .map((product) => (
                                                        <div key={product.id} className="p-5 space-y-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                                                    <img
                                                                        src={product.image_url || product.image}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-grow min-w-0">
                                                                    <h4 className="font-bold text-gray-900 truncate leading-tight">{product.name}</h4>
                                                                    <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                                        {Array.isArray(product.sizes) && product.sizes.map(size => (
                                                                            <span key={size} className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-gray-600 font-black shadow-sm">{size}</span>
                                                                        ))}
                                                                    </div>
                                                                    <p className="font-black text-red-600 mt-1">{formatPrice(product.price)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                                                <div className="flex gap-2">
                                                                    {product.is_out_of_stock && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest">
                                                                            Out of Stock
                                                                        </span>
                                                                    )}
                                                                    {product.is_highlighted && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest">
                                                                            Highlighted
                                                                        </span>
                                                                    )}
                                                                    {product.on_offer && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                                                                            Offer
                                                                        </span>
                                                                    )}
                                                                    {!product.is_out_of_stock && !product.on_offer && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                                                                            Active
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => openEditModal(product, "product")}
                                                                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 font-bold text-xs transition-colors border border-gray-100"
                                                                    >
                                                                        <Edit2 size={14} />
                                                                        <span>Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(product.id, "products")}
                                                                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-600 rounded-xl text-red-600 hover:text-white font-bold text-xs transition-colors border border-red-100"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        <span>Delete</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </section>
                    </div>
                </div>
            </main>

            {/* --- MODAL FORM --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-xl font-black tracking-tight">
                                    {editItem ? "Edit" : "Add New"} Product
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 overflow-y-auto flex-grow custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Product Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                                            placeholder="e.g. Minimalist Tote"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price (KSh)</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                                            placeholder="29.99"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm"
                                            placeholder="e.g. Clothes, Curtains, etc."
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {formData.category?.toLowerCase() !== 'curtains' && formData.category?.toLowerCase() !== 'curtain' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="md:col-span-2 overflow-hidden"
                                            >
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                    Available Sizes (Comma separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.sizes}
                                                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                                                    placeholder="e.g. S, M, L, XL"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Images (Select multiple files)
                                        </label>
                                        <div className="flex flex-col gap-3">
                                            {/* File Input */}
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    setFormData({ ...formData, imageFiles: files });
                                                }}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                                            />

                                            {/* Preview uploaded/selected images */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {/* Existing Images */}
                                                {formData.images && formData.images.map((url, idx) => (
                                                    <div key={`existing-${idx}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                                                        <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = [...formData.images];
                                                                newImages.splice(idx, 1);
                                                                setFormData({ ...formData, images: newImages });
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 w-4 h-4 flex items-center justify-center shadow-lg"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Fallback to single image_url if images array is empty (legacy support) */}
                                                {(!formData.images || formData.images.length === 0) && formData.image_url && (
                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                                                        <img src={formData.image_url} alt="Legacy primary" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, image_url: "" })}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 w-4 h-4 flex items-center justify-center shadow-lg"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                                {/* New Local Files Preview */}
                                                {formData.imageFiles && formData.imageFiles.map((file, idx) => (
                                                    <div key={`new-${idx}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-200">
                                                        <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-full object-cover" />
                                                        <span className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-widest backdrop-blur-sm">New</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all resize-none"
                                            placeholder="Tell us about this item..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-red-100 transition-all cursor-pointer group" onClick={() => setFormData({ ...formData, is_out_of_stock: !formData.is_out_of_stock })}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.is_out_of_stock ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-red-400"}`}>
                                                {formData.is_out_of_stock ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Status</span>
                                                <span className={`text-xs font-bold ${formData.is_out_of_stock ? "text-red-600" : "text-gray-900"}`}>{formData.is_out_of_stock ? "Out of Stock" : "In Stock"}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-emerald-100 transition-all cursor-pointer group" onClick={() => setFormData({ ...formData, on_offer: !formData.on_offer })}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.on_offer ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-400"}`}>
                                                <TrendingUp size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Offer Visibility</span>
                                                <span className={`text-xs font-bold ${formData.on_offer ? "text-emerald-600" : "text-gray-900"}`}>{formData.on_offer ? "On Offer" : "Regular Price"}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-red-100 transition-all cursor-pointer group col-span-2" onClick={() => setFormData({ ...formData, is_highlighted: !formData.is_highlighted })}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.is_highlighted ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-red-400"}`}>
                                                <TrendingUp size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hero Highlights</span>
                                                <span className={`text-xs font-bold ${formData.is_highlighted ? "text-red-600" : "text-gray-900"}`}>{formData.is_highlighted ? "Added to Highlights" : "Regular List"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.on_offer && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="md:col-span-2"
                                        >
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Original "Was" Price (KSh)</label>
                                            <input
                                                required={formData.on_offer}
                                                type="number"
                                                step="0.01"
                                                value={formData.original_price}
                                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                                className="w-full bg-pink-50/50 border border-pink-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                                                placeholder="e.g. 5000"
                                            />
                                            <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-widest">This price will be shown with a strikethrough.</p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-grow py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        <span>{editItem ? "Update" : "Create"} Product</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
