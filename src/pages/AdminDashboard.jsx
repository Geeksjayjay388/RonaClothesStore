import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Package,
    Layers,
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Search,
    ChevronRight,
    TrendingUp,
    ShoppingBag,
    UserPlus,
    DollarSign,
    MoreVertical,
    Save,
    X,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);

    // Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("product"); // "product" or "collection"
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        title: "", // for collections
        price: "",
        description: "",
        category: "",
        tag: "", // for collections
        image_url: "",
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

        const collectionsChannel = supabase
            .channel('admin-collections-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
            supabase.removeChannel(collectionsChannel);
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, colRes] = await Promise.all([
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('collections').select('*').order('created_at', { ascending: false })
            ]);

            if (prodRes.error) {
                console.error("Products fetch error:", prodRes.error);
                toast.error("Products table fetch error");
            } else if (prodRes.data) {
                setProducts(prodRes.data);
            }

            if (colRes.error) {
                console.error("Collections fetch error:", colRes.error);
                toast.error("Collections table fetch error");
            } else if (colRes.data) {
                setCollections(colRes.data);
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
        const table = modalMode === "product" ? "products" : "collections";

        try {
            const payload = modalMode === "product" ? {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                image_url: formData.image_url,
            } : {
                title: formData.title,
                description: formData.description,
                tag: formData.tag,
                image_url: formData.image_url,
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
            setFormData({ name: "", title: "", price: "", description: "", category: "", tag: "", image_url: "" });
            fetchData();
        } catch (error) {
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
            title: item.title || "",
            price: item.price || "",
            description: item.description || "",
            category: item.category || "",
            tag: item.tag || "",
            image_url: item.image_url || "",
        });
        setIsModalOpen(true);
    };

    const sidebarItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "products", label: "Products", icon: Package },
        { id: "collections", label: "Collections", icon: Layers },
    ];

    const stats = [
        { label: "Inventory", value: products.length, icon: Package, trend: `+${products.length}`, color: "emerald" },
        { label: "Collections", value: collections.length, icon: Layers, trend: `+${collections.length}`, color: "blue" },
        { label: "Retail Value", value: `$${products.reduce((acc, p) => acc + parseFloat(p.price), 0).toFixed(0)}`, icon: DollarSign, trend: "Live", color: "purple" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Navbar />

            <main className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* --- SIDEBAR --- */}
                        <aside className="w-full lg:w-64 flex flex-col gap-4">
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

                            <div className="bg-indigo-600 rounded-3xl p-6 shadow-xl shadow-indigo-100 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-black text-lg mb-1 italic">Pro Features</h4>
                                    <p className="text-sm text-indigo-100 mb-4 font-medium">Connect Shop to Meta Catalog and TikTok.</p>
                                    <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
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
                                        {activeTab}<span className="text-indigo-600">.</span>
                                    </h1>
                                    <p className="text-gray-500 font-medium text-sm mt-1">Manage your storefront products and collections.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {(activeTab === "products" || activeTab === "collections") && (
                                        <button
                                            onClick={() => {
                                                setModalMode(activeTab === "products" ? "product" : "collection");
                                                setEditItem(null);
                                                setIsModalOpen(true);
                                            }}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 text-sm whitespace-nowrap"
                                        >
                                            <Plus size={18} />
                                            <span>Add {activeTab === "products" ? "Product" : "Collection"}</span>
                                        </button>
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
                                                                className="bg-indigo-50 border-x border-t border-indigo-100 rounded-t-lg group-hover:bg-indigo-600 transition-colors"
                                                            />
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                ${h * 12}
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
                                                        { label: "Inventory", value: "Optimal", color: "emerald", score: 98 },
                                                        { label: "Delivery", value: "Delayed", color: "amber", score: 72 },
                                                        { label: "Satisfaction", value: "Excellent", color: "indigo", score: 95 },
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

                                {(activeTab === "products" || activeTab === "collections") && (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
                                    >
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Preview</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Details</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right" style={{ width: '120px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {(activeTab === "products" ? products : collections).length === 0 ? (
                                                        <tr>
                                                            <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-medium">
                                                                No {activeTab} found. Click 'Add {activeTab === "products" ? "Product" : "Collection"}' to create one.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        (activeTab === "products" ? products : collections).map((item) => (
                                                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-8 py-4">
                                                                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden">
                                                                        <img
                                                                            src={item.image_url || item.image}
                                                                            alt={item.name || item.title}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-4">
                                                                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">{item.name || item.title}</h4>
                                                                    <p className="text-xs text-gray-500 mt-0.5">{item.category || item.tag}</p>
                                                                </td>
                                                                <td className="px-8 py-4">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                                        Active
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button
                                                                            onClick={() => openEditModal(item, activeTab === "products" ? "product" : "collection")}
                                                                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-indigo-600 border border-transparent hover:border-gray-100"
                                                                        >
                                                                            <Edit2 size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(item.id, activeTab === "products" ? "products" : "collections")}
                                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100"
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
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-xl font-black tracking-tight">
                                    {editItem ? "Edit" : "Add New"} {modalMode === "product" ? "Product" : "Collection"}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            {modalMode === "product" ? "Product Name" : "Collection Title"}
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={modalMode === "product" ? formData.name : formData.title}
                                            onChange={(e) => setFormData({ ...formData, [modalMode === "product" ? 'name' : 'title']: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                            placeholder={modalMode === "product" ? "e.g. Minimalist Tote" : "e.g. Summer Series"}
                                        />
                                    </div>

                                    {modalMode === "product" ? (
                                        <>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                                                <input
                                                    required
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
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
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                                    placeholder="Tops, Shoes, etc."
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.tag}
                                                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                                placeholder="Seasonal, New, etc."
                                            />
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                                        <div className="flex gap-3">
                                            <input
                                                required
                                                type="url"
                                                value={formData.image_url}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                                {formData.image_url ? (
                                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-gray-300" size={20} />
                                                )}
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
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                                            placeholder="Tell us about this item..."
                                        />
                                    </div>
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
                                        <span>{editItem ? "Update" : "Create"} {modalMode}</span>
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
