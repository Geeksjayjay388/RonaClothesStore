import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff,
  Tags,
  Star,
  ShieldCheck,
  MessagesSquare,
  CheckCircle2,
  XCircle,
  PhoneCall,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/formatters";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  category: "",
  image_url: "",
  images: [],
  imageFiles: [],
  is_out_of_stock: false,
  on_offer: false,
  is_highlighted: false,
  original_price: "",
  sizes: "",
};

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingRequests, setIsFetchingRequests] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
      console.error("Fetch products error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchSellerRequests = async () => {
    setIsFetchingRequests(true);
    try {
      const { data, error } = await supabase
        .from("seller_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSellerRequests(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch seller requests");
      console.error("Fetch seller requests error:", error);
    } finally {
      setIsFetchingRequests(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSellerRequests();

    const productsChannel = supabase
      .channel("admin-products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        fetchData
      )
      .subscribe();

    const requestsChannel = supabase
      .channel("admin-seller-requests-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seller_requests" },
        fetchSellerRequests
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.category) set.add(product.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category?.toLowerCase() === categoryFilter.toLowerCase();

      let matchesStatus = true;
      if (statusFilter === "instock") matchesStatus = !product.is_out_of_stock;
      if (statusFilter === "outofstock") matchesStatus = !!product.is_out_of_stock;
      if (statusFilter === "onoffer") matchesStatus = !!product.on_offer;
      if (statusFilter === "highlighted") matchesStatus = !!product.is_highlighted;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const filteredSellerRequests = useMemo(() => {
    return sellerRequests.filter((request) => {
      if (requestStatusFilter === "all") return true;
      return request.status === requestStatusFilter;
    });
  }, [sellerRequests, requestStatusFilter]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.is_out_of_stock).length;
    const inStock = totalProducts - outOfStock;
    const onOffer = products.filter((p) => p.on_offer).length;
    const highlighted = products.filter((p) => p.is_highlighted).length;
    const inventoryValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
    const pendingRequests = sellerRequests.filter((request) => request.status === "pending").length;

    return {
      totalProducts,
      inStock,
      outOfStock,
      onOffer,
      highlighted,
      inventoryValue,
      pendingRequests,
    };
  }, [products, sellerRequests]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
    setFormData(EMPTY_FORM);
  };

  const openCreateModal = () => {
    setEditItem(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || "",
      price: item.price ?? "",
      description: item.description || "",
      category: item.category || "",
      image_url: item.image_url || "",
      images: item.images || [],
      imageFiles: [],
      is_out_of_stock: !!item.is_out_of_stock,
      on_offer: !!item.on_offer,
      is_highlighted: !!item.is_highlighted,
      original_price: item.original_price ?? "",
      sizes: Array.isArray(item.sizes) ? item.sizes.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted");
      await fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const updateSellerRequestStatus = async (id, status) => {
    setUpdatingRequestId(id);
    try {
      const { error } = await supabase
        .from("seller_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success("Request status updated");
      await fetchSellerRequests();
    } catch (error) {
      toast.error(error.message || "Failed to update request status");
      console.error("Update seller request status error:", error);
    } finally {
      setUpdatingRequestId(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const parsedPrice = Number(formData.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (formData.on_offer) {
      const parsedOriginal = Number(formData.original_price);
      if (!Number.isFinite(parsedOriginal) || parsedOriginal <= 0) {
        toast.error("Please enter a valid original price");
        return;
      }
    }

    setIsSaving(true);
    try {
      let uploadedUrls = [...(formData.images || [])];
      let primaryImageUrl = formData.image_url || "";

      if (formData.imageFiles.length > 0) {
        toast.loading("Uploading images...", { id: "upload-toast" });

        for (const file of formData.imageFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, file, { cacheControl: "3600", upsert: false });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error(`Upload failed: ${file.name}`);
            continue;
          }

          const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
          uploadedUrls.push(data.publicUrl);
        }

        toast.dismiss("upload-toast");
        if (!primaryImageUrl && uploadedUrls.length > 0) {
          primaryImageUrl = uploadedUrls[0];
        }
      }

      const categoryValue = formData.category.trim();
      const isCurtainsCategory =
        categoryValue.toLowerCase() === "curtain" ||
        categoryValue.toLowerCase() === "curtains";

      const payload = {
        name: formData.name.trim(),
        price: parsedPrice,
        description: formData.description.trim(),
        category: categoryValue,
        image_url: primaryImageUrl || uploadedUrls[0] || "",
        images: uploadedUrls,
        is_out_of_stock: formData.is_out_of_stock,
        on_offer: formData.on_offer,
        is_highlighted: formData.is_highlighted,
        original_price: formData.on_offer ? Number(formData.original_price) : null,
        sizes: isCurtainsCategory
          ? []
          : formData.sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean),
      };

      if (editItem) {
        const { error } = await supabase.from("products").update(payload).eq("id", editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      toast.success(editItem ? "Product updated" : "Product created");
      closeModal();
      await fetchData();
    } catch (error) {
      toast.dismiss("upload-toast");
      toast.error(error.message || "Failed to save product");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const cardClass = "bg-white border border-gray-200 rounded-2xl p-6";
  const kpiCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package },
    { label: "In Stock", value: stats.inStock, icon: Eye },
    { label: "Out of Stock", value: stats.outOfStock, icon: EyeOff },
    { label: "On Offer", value: stats.onOffer, icon: Tags },
    { label: "Highlighted", value: stats.highlighted, icon: Star },
    { label: "Pending Requests", value: stats.pendingRequests, icon: MessagesSquare },
    { label: "Inventory Value", value: formatPrice(stats.inventoryValue), icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-gray-900">
      <div className="flex min-h-screen">
        <aside className="w-[280px] border-r border-gray-200 bg-white px-5 py-6 hidden lg:flex lg:flex-col">
          <div className="px-3 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
              Rona
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-900 text-white font-semibold flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <span>{profile?.first_name?.[0] || "A"}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate text-gray-900">
                  {profile?.first_name || "Admin"} {profile?.last_name || ""}
                </p>
                <p className="text-xs text-gray-500">Store Administrator</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === "overview"
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === "products"
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Package size={18} />
              Products
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === "requests"
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <MessagesSquare size={18} />
              Seller Requests
            </button>
          </nav>

          <div className="mt-auto rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <ShieldCheck size={16} />
              <p className="text-xs font-semibold uppercase tracking-widest">Catalog Health</p>
            </div>
            <p className="text-3xl font-bold leading-none text-gray-900">{stats.pendingRequests}</p>
            <p className="text-sm text-gray-600 mt-1">Pending seller requests</p>
          </div>
        </aside>

        <main className="flex-1 px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-24 lg:pb-8 lg:px-8 lg:py-8">
          <section className="space-y-6 max-w-7xl mx-auto">
            <div className={`${cardClass} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Admin Panel</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {activeTab === "overview"
                    ? "Overview"
                    : activeTab === "products"
                      ? "Products"
                      : "Seller Requests"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === "overview"
                    ? "High-level operational metrics for your store."
                    : activeTab === "products"
                      ? "Manage inventory, pricing, and listing status in one place."
                      : "Track seller submissions and update request statuses."}
                </p>
              </div>

              {activeTab === "products" && (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium text-sm"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              )}
            </div>

            {activeTab === "overview" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {kpiCards.map((card) => (
                    <div key={card.label} className={cardClass}>
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                          {card.label}
                        </p>
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 border border-gray-200">
                          {React.createElement(card.icon, { size: 18 })}
                        </div>
                      </div>
                      <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                    </div>
                  ))}
                </div>

                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold tracking-tight">Newest Products</h2>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="text-xs font-semibold uppercase tracking-widest text-gray-700 hover:text-black"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="py-4 flex items-center gap-4">
                        <img
                          src={product.image_url || product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category || "Uncategorized"}</p>
                        </div>
                        <p className="font-semibold">{formatPrice(product.price)}</p>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <p className="text-sm text-gray-500 py-8 text-center">
                        No products found yet.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : activeTab === "products" ? (
              <>
                <div className={`${cardClass} flex flex-col lg:flex-row gap-3`}>
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, category or description..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 font-medium focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="relative">
                      <Filter
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-3 font-medium focus:outline-none focus:border-gray-400"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-gray-400"
                    >
                      <option value="all">All Status</option>
                      <option value="instock">In Stock</option>
                      <option value="outofstock">Out of Stock</option>
                      <option value="onoffer">On Offer</option>
                      <option value="highlighted">Highlighted</option>
                    </select>
                  </div>
                </div>

                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Products ({filteredProducts.length})</h2>
                    {isFetching && <Loader2 size={18} className="animate-spin text-gray-400" />}
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Product</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Category</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Price</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Status</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="border-b border-gray-50">
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={product.image_url || product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold truncate">{product.name}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {Array.isArray(product.sizes) && product.sizes.length > 0
                                      ? `Sizes: ${product.sizes.join(", ")}`
                                      : "No size variants"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-sm font-medium">{product.category || "-"}</td>
                            <td className="py-4 font-black">{formatPrice(product.price)}</td>
                            <td className="py-4">
                              <div className="flex flex-wrap gap-1.5">
                                {product.is_out_of_stock && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                    Out
                                  </span>
                                )}
                                {product.on_offer && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                    Offer
                                  </span>
                                )}
                                {product.is_highlighted && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                    Highlight
                                  </span>
                                )}
                                {!product.is_out_of_stock &&
                                  !product.on_offer &&
                                  !product.is_highlighted && (
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                      Active
                                    </span>
                                  )}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(product)}
                                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  disabled={deletingId === product.id}
                                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 disabled:opacity-60"
                                >
                                  {deletingId === product.id ? (
                                    <Loader2 size={15} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={15} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden space-y-3">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="border border-gray-100 rounded-2xl p-4">
                        <div className="flex gap-3">
                          <img
                            src={product.image_url || product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{product.category || "Uncategorized"}</p>
                            <p className="font-semibold mt-1">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-widest"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 py-2 rounded-xl bg-gray-900 text-white font-semibold text-xs uppercase tracking-widest"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isFetching && filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-10">
                      No products match your current filters.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={`${cardClass} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
                  <div>
                    <h3 className="text-lg font-bold">Seller Requests</h3>
                    <p className="text-sm text-gray-500">Review and update inbound seller submissions.</p>
                  </div>
                  <select
                    value={requestStatusFilter}
                    onChange={(e) => setRequestStatusFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-gray-400"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Requests ({filteredSellerRequests.length})</h2>
                    {isFetchingRequests && <Loader2 size={18} className="animate-spin text-gray-400" />}
                  </div>

                  <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Seller</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Product</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Price</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Status</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400">Created</th>
                          <th className="py-3 text-[10px] uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSellerRequests.map((request) => (
                          <tr key={request.id} className="border-b border-gray-50 align-top">
                            <td className="py-4 pr-4">
                              <p className="font-semibold">{request.seller_name}</p>
                              <p className="text-xs text-gray-500">{request.seller_phone}</p>
                              {request.seller_email && (
                                <p className="text-xs text-gray-500">{request.seller_email}</p>
                              )}
                            </td>
                            <td className="py-4 pr-4">
                              <p className="font-semibold">{request.product_name}</p>
                              <p className="text-xs text-gray-500">{request.category}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{request.description}</p>
                            </td>
                            <td className="py-4 font-semibold whitespace-nowrap">{formatPrice(request.price)}</td>
                            <td className="py-4">
                              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase tracking-widest">
                                {request.status}
                              </span>
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap">
                              {new Date(request.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => updateSellerRequestStatus(request.id, "contacted")}
                                  disabled={updatingRequestId === request.id}
                                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900"
                                  title="Mark contacted"
                                >
                                  <PhoneCall size={14} />
                                </button>
                                <button
                                  onClick={() => updateSellerRequestStatus(request.id, "approved")}
                                  disabled={updatingRequestId === request.id}
                                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-emerald-700"
                                  title="Approve"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                                <button
                                  onClick={() => updateSellerRequestStatus(request.id, "rejected")}
                                  disabled={updatingRequestId === request.id}
                                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-700"
                                  title="Reject"
                                >
                                  <XCircle size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="xl:hidden space-y-3">
                    {filteredSellerRequests.map((request) => (
                      <div key={request.id} className="border border-gray-100 rounded-2xl p-4">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-semibold">{request.seller_name}</p>
                            <p className="text-xs text-gray-500">{request.seller_phone}</p>
                            <p className="text-xs text-gray-500 mt-1">{request.product_name}</p>
                          </div>
                          <span className="h-fit px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase tracking-widest">
                            {request.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{request.description}</p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => updateSellerRequestStatus(request.id, "contacted")}
                            className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-widest"
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => updateSellerRequestStatus(request.id, "approved")}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase tracking-widest"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateSellerRequestStatus(request.id, "rejected")}
                            className="flex-1 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold uppercase tracking-widest"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isFetchingRequests && filteredSellerRequests.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-10">No seller requests found.</p>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40 px-2 py-2 flex justify-around items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe"
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${activeTab === "overview" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <LayoutDashboard size={20} className={activeTab === "overview" ? "text-gray-900" : ""} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex flex-col items-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${activeTab === "products" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <Package size={20} className={activeTab === "products" ? "text-gray-900" : ""} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Products</span>
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex flex-col items-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${activeTab === "requests" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <div className="relative">
            <MessagesSquare size={20} className={activeTab === "requests" ? "text-gray-900" : ""} />
            {stats.pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Requests</span>
        </button>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[92vh] overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight">
                {editItem ? "Edit Product" : "Create Product"}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[calc(92vh-84px)] space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Product Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Price (KSh)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Category
                  </label>
                  <input
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>

                {formData.category.trim().toLowerCase() !== "curtain" &&
                  formData.category.trim().toLowerCase() !== "curtains" && (
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Sizes (comma separated)
                      </label>
                      <input
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-red-500"
                      />
                    </div>
                  )}

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData({ ...formData, imageFiles: files });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-lg file:bg-red-50 file:text-red-600 file:font-bold"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.images.map((url, idx) => (
                      <div key={`${url}-${idx}`} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt="Product" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {formData.imageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.imageFiles.map((file) => (
                        <span
                          key={file.name}
                          className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium resize-none focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_out_of_stock: !formData.is_out_of_stock })
                  }
                  className={`px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition ${formData.is_out_of_stock
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-red-300"
                    }`}
                >
                  {formData.is_out_of_stock ? "Out of Stock" : "In Stock"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, on_offer: !formData.on_offer })}
                  className={`px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition ${formData.on_offer
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-emerald-300"
                    }`}
                >
                  {formData.on_offer ? "On Offer" : "Regular"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_highlighted: !formData.is_highlighted })
                  }
                  className={`px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition ${formData.is_highlighted
                      ? "bg-amber-500 border-amber-500 text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-amber-300"
                    }`}
                >
                  {formData.is_highlighted ? "Highlighted" : "Not Highlighted"}
                </button>
              </div>

              {formData.on_offer && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Original Price (KSh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required={formData.on_offer}
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-widest hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[1.4] py-3.5 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-black flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editItem ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
