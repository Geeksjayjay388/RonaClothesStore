import React, { useState, useEffect } from "react";
import {
    User as UserIcon,
    MapPin,
    Package,
    Heart,
    LogOut,
    Settings,
    Camera,
    Shield,
    Bell,
    CreditCard,
    ChevronRight,
    Edit3,
    Mail,
    Phone,
    Calendar,
    Award,
    TrendingUp,
    Activity,
    Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../lib/formatters";

const ProfilePage = () => {
    const { user, signOut, profile, refreshProfile } = useAuth();
    const navigate = useNavigate();

    // Core Profile State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
    });

    useEffect(() => {
        if (!user && !loading) {
            navigate("/login");
            return;
        }

        if (profile) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
            });
            setLoading(false);
        }
    }, [user, profile, loading, navigate]);

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Signed out successfully");
            navigate("/");
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    const fileInputRef = React.useRef(null);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast.error("Image must be less than 2MB");
            return;
        }

        setSaving(true);
        const toastId = toast.loading("Updating your archive image...");

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { cacheControl: '3600', upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update Profile in Database
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await refreshProfile();
            toast.success("Profile image updated!", { id: toastId });
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error("Failed to upload image. Ensure you have permissions.", { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!formData.first_name.trim()) {
            toast.error("First name is required");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
            console.error("Profile Update Error:", error);
        } finally {
            setSaving(false);
        }
    };

    // Derived Display Data (Fallback to metadata or email if profile hasn't synced)
    const displayFirstName = profile?.first_name || user?.user_metadata?.first_name || (user?.email ? user.email.split('@')[0] : "Guest");
    const displayLastName = profile?.last_name || user?.user_metadata?.last_name || "";
    const email = user?.email || "No email available";

    // Initialize/Update form data when profile or user changes
    useEffect(() => {
        if (!isEditing) {
            setFormData({
                first_name: profile?.first_name || user?.user_metadata?.first_name || "",
                last_name: profile?.last_name || user?.user_metadata?.last_name || "",
            });
        }
    }, [profile, user, isEditing]);

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : "March 2024";

    const menuItems = [
        { id: "personal", icon: UserIcon, label: "Personal Info", color: "blue" },
        { id: "orders", icon: Package, label: "Order History", color: "pink", badge: "0" },
        { id: "wishlist", icon: Heart, label: "Wishlist", color: "pink", badge: "0" },
        { id: "preferences", icon: Settings, label: "Preferences", color: "gray" },
    ];

    const stats = [
        { label: "Orders", value: "0", trend: "0%", icon: Package },
        { label: "Spent", value: formatPrice(0), trend: "0%", icon: TrendingUp },
        { label: "Points", value: "0", trend: "New", icon: Award },
        { label: "Activity", value: "100%", trend: "Active", icon: Activity },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-red-600 animate-spin" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing the Archive...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
            <Navbar />

            <main className="flex-grow pt-24 pb-24">
                <div className="container mx-auto px-6 lg:px-12 max-w-7xl">

                    {/* --- HERO HEADER --- */}
                    <div className="relative mb-8">
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Avatar */}
                                <div className="relative group">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="w-28 h-28 rounded-2xl bg-red-600 flex items-center justify-center overflow-hidden shadow-lg shadow-red-100 relative">
                                        {profile?.avatar_url ? (
                                            <img
                                                src={`${profile.avatar_url}?t=${new Date().getTime()}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error("ProfilePage: Image failed to load:", profile.avatar_url);
                                                }}
                                            />
                                        ) : (
                                            <span className="text-3xl font-bold text-white uppercase">
                                                {displayFirstName[0]}{displayLastName ? displayLastName[0] : ""}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                                    >
                                        <Camera size={18} className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="flex-grow text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-baseline gap-3 mb-4">
                                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                                            {displayFirstName} {displayLastName}
                                        </h1>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-5 text-gray-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400" />
                                            <span className="text-sm">{email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-sm">Member since {joinDate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => {
                                            if (isEditing) handleSaveProfile();
                                            else setIsEditing(true);
                                        }}
                                        disabled={saving}
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${isEditing
                                            ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                                            : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : isEditing ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> : <Edit3 size={18} />}
                                        <span>{saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}</span>
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 rounded-xl transition-all font-bold text-sm group"
                                    >
                                        <LogOut size={18} className="text-red-500 group-hover:translate-x-1 transition-transform" />
                                        <span className="text-red-500">Sign Out</span>
                                    </button>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center md:text-left group">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="text-xl font-black text-gray-900">{stat.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* --- SIDEBAR NAVIGATION --- */}
                        <aside className="w-full lg:w-72 space-y-4">
                            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                                <nav className="space-y-1">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${isActive
                                                    ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                                                    : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"} />
                                                    <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {item.badge !== "0" && item.badge && (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white/20" : "bg-gray-100 text-gray-600"
                                                            }`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    <ChevronRight size={14} className={`transition-transform duration-300 ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Mini Promo Card */}
                            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-gray-100 relative overflow-hidden group">
                                <h3 className="font-black text-white text-lg mb-1 relative z-10">Archive Perks</h3>
                                <p className="text-gray-400 text-xs mb-4 relative z-10 font-medium tracking-wide leading-relaxed">Early access to limited drops and exclusive insights.</p>
                                <button className="w-full py-2.5 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors relative z-10 shadow-sm">
                                    Learn More
                                </button>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" />
                            </div>
                        </aside>

                        {/* --- MAIN CONTENT --- */}
                        <div className="flex-grow">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                {/* Content Header */}
                                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
                                            {menuItems.find(i => i.id === activeTab)?.label}
                                        </h2>
                                        <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-[0.15em]">Personal Information & Security</p>
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        first_name: profile?.first_name || "",
                                                        last_name: profile?.last_name || "",
                                                    });
                                                }}
                                                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-5 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8">
                                    {activeTab === "personal" && (
                                        <>
                                            {/* Form Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-gray-900 transition-colors">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.first_name}
                                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                        readOnly={!isEditing}
                                                        placeholder="First Name"
                                                        className={`w-full bg-white border-2 rounded-xl px-5 py-4 text-gray-900 font-bold focus:outline-none focus:border-gray-900 transition-all ${isEditing ? "border-gray-200" : "border-gray-50 bg-gray-50/50 text-gray-500 cursor-default"
                                                            }`}
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-gray-900 transition-colors">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.last_name}
                                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                        readOnly={!isEditing}
                                                        placeholder="Last Name"
                                                        className={`w-full bg-white border-2 rounded-xl px-5 py-4 text-gray-900 font-bold focus:outline-none focus:border-gray-900 transition-all ${isEditing ? "border-gray-200" : "border-gray-50 bg-gray-50/50 text-gray-500 cursor-default"
                                                            }`}
                                                    />
                                                </div>

                                                <div className="group md:col-span-2">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-gray-900 transition-colors">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="email"
                                                            defaultValue={email}
                                                            readOnly={true}
                                                            className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-5 py-4 text-gray-400 font-bold cursor-default"
                                                        />
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Security Overview */}
                                            <div className="border-t border-gray-100 pt-10">
                                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                    <Shield size={18} className="text-gray-400" />
                                                    Security Overview
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-200/50 hover:border-gray-300 transition-all group cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                                                <Shield className="text-gray-900" size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Account Status</h4>
                                                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Secure</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-200/50 hover:border-gray-300 transition-all group cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                                                <Bell className="text-gray-400" size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Login Alerts</h4>
                                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">Push Only</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTab !== "personal" && (
                                        <div className="py-20 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                                <Loader2 size={24} className="text-gray-300 animate-spin" />
                                            </div>
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Coming Soon</h3>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Our engineers are curating this section.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">
                                            Live Synced
                                        </p>
                                    </div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase">
                                        ID • {user?.id?.slice(0, 8) || "8X9A2B4C"}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main >

            <Footer />
        </div >
    );
};

export default ProfilePage;