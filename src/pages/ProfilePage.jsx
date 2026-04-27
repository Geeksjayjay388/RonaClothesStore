import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Calendar,
  ChevronRight,
  Edit3,
  Heart,
  Loader2,
  LogOut,
  Mail,
  Package,
  Settings,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/formatters";
import { supabase } from "../lib/supabase";

const ProfilePage = () => {
  const { user, signOut, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPageLoading(false);
  }, [user, navigate]);

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        first_name: profile?.first_name || user?.user_metadata?.first_name || "",
        last_name: profile?.last_name || user?.user_metadata?.last_name || "",
      });
    }
  }, [profile, user, isEditing]);

  const displayFirstName =
    profile?.first_name || user?.user_metadata?.first_name || (user?.email ? user.email.split("@")[0] : "Guest");
  const displayLastName = profile?.last_name || user?.user_metadata?.last_name || "";
  const email = user?.email || "No email available";
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recent";

  const menuItems = [
    { id: "personal", icon: UserIcon, label: "Personal Info" },
    { id: "orders", icon: Package, label: "Order History" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "preferences", icon: Settings, label: "Preferences" },
  ];

  const stats = [
    { label: "Orders", value: "0" },
    { label: "Spent", value: formatPrice(0) },
    { label: "Wishlist", value: "0" },
    { label: "Status", value: "Active" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Could not sign out");
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Uploading profile image...");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
      if (updateError) throw updateError;

      await refreshProfile();
      toast.success("Profile image updated", { id: toastId });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to update image", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!formData.first_name.trim()) {
      toast.error("First name is required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
        })
        .eq("id", user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-gray-500" size={40} />
          <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Loading profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <div className="w-24 h-24 rounded-2xl bg-gray-900 text-white flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={`${profile.avatar_url}?t=${Date.now()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold uppercase">
                      {displayFirstName[0]}
                      {displayLastName ? displayLastName[0] : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {displayFirstName} {displayLastName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={15} /> {email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={15} /> Member since {joinDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                  disabled={saving}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
                    isEditing ? "bg-gray-900 text-white hover:bg-black" : "bg-white border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-red-600 hover:bg-red-50 transition inline-flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-gray-100">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{stat.label}</p>
                  <p className="text-lg font-semibold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            <aside className="bg-white border border-gray-200 rounded-2xl p-3 h-fit">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${
                      active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3 font-medium">
                      <Icon size={17} />
                      {item.label}
                    </span>
                    <ChevronRight size={15} />
                  </button>
                );
              })}
            </aside>

            <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold">{menuItems.find((m) => m.id === activeTab)?.label}</h2>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Profile and account settings</p>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === "personal" ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          readOnly={!isEditing}
                          value={formData.first_name}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, first_name: event.target.value }))
                          }
                          className={`w-full rounded-xl px-4 py-3 border ${
                            isEditing
                              ? "bg-white border-gray-200 focus:outline-none focus:border-gray-400"
                              : "bg-gray-50 border-gray-100 text-gray-500"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          readOnly={!isEditing}
                          value={formData.last_name}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, last_name: event.target.value }))
                          }
                          className={`w-full rounded-xl px-4 py-3 border ${
                            isEditing
                              ? "bg-white border-gray-200 focus:outline-none focus:border-gray-400"
                              : "bg-gray-50 border-gray-100 text-gray-500"
                          }`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          readOnly
                          value={email}
                          className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-100 text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700 mb-4 inline-flex items-center gap-2">
                        <Shield size={16} />
                        Security
                      </h3>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600">
                          Your account is protected. Keep your profile and login details up to date.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-gray-300 mx-auto mb-4" size={24} />
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-600">Coming Soon</p>
                    <p className="text-xs text-gray-500 mt-1">This section is being prepared.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
