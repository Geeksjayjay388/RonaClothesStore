import React, { useState } from "react";
import { Loader2, Upload, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const WHATSAPP_NUMBER = "+254742424046";

const normalizeKenyanPhone = (value) => {
  const cleaned = value.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+254") && cleaned.length === 13) return cleaned;
  if (cleaned.startsWith("254") && cleaned.length === 12) return `+${cleaned}`;
  if ((cleaned.startsWith("07") || cleaned.startsWith("01")) && cleaned.length === 10) {
    return `+254${cleaned.slice(1)}`;
  }

  return null;
};

const SellPage = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    seller_name: "",
    seller_phone: "",
    product_name: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    images: [],
  });

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > MAX_IMAGES) {
      toast.error(`Upload up to ${MAX_IMAGES} images only.`);
      return;
    }

    const hasOversized = files.some((file) => file.size > MAX_IMAGE_SIZE);
    if (hasOversized) {
      toast.error("Each image must be 5MB or less.");
      return;
    }

    const hasInvalidType = files.some((file) => !file.type.startsWith("image/"));
    if (hasInvalidType) {
      toast.error("Only image files are allowed.");
      return;
    }

    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedPhone = normalizeKenyanPhone(formData.seller_phone);
    if (!normalizedPhone) {
      toast.error("Enter a valid Kenyan phone number.");
      return;
    }

    const parsedPrice = Number(formData.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error("Enter a valid price.");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setSaving(true);
    try {
      const uploadedImageUrls = [];

      for (const [index, file] of formData.images.entries()) {
        const extension = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${index}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("seller-requests")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("seller-requests").getPublicUrl(path);
        uploadedImageUrls.push(data.publicUrl);
      }

      const payload = {
        user_id: user.id,
        seller_name: formData.seller_name.trim(),
        seller_phone: normalizedPhone,
        seller_email: user.email || null,
        product_name: formData.product_name.trim(),
        category: formData.category.trim(),
        price: parsedPrice,
        product_condition: formData.condition.trim(),
        description: formData.description.trim(),
        image_urls: uploadedImageUrls,
        status: "pending",
      };

      const { error } = await supabase.from("seller_requests").insert([payload]);
      if (error) throw error;

      const imageLines = uploadedImageUrls.map((url, i) => `${i + 1}. ${url}`).join("\n");
      const message = encodeURIComponent(
        `Hello RONA, I want to sell on Rona.\n\n` +
          `Seller Details\n` +
          `- Name: ${payload.seller_name}\n` +
          `- Phone: ${payload.seller_phone}\n` +
          `- Email: ${payload.seller_email || "N/A"}\n\n` +
          `Product Details\n` +
          `- Product: ${payload.product_name}\n` +
          `- Category: ${payload.category}\n` +
          `- Price: KES ${payload.price}\n` +
          `- Condition: ${payload.product_condition}\n` +
          `- Description: ${payload.description}\n\n` +
          `Image Links\n${imageLines}`
      );

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

      toast.success("Request submitted. Opening WhatsApp...");
      setFormData({
        seller_name: "",
        seller_phone: "",
        product_name: "",
        category: "",
        price: "",
        condition: "",
        description: "",
        images: [],
      });
    } catch (error) {
      console.error("Sell request submission error:", error);
      toast.error(error.message || "Failed to submit request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                Seller Intake
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Sell on Rona
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Submit your product details. We will save your request and send it to RONA via WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Your Name</label>
                  <input
                    required
                    value={formData.seller_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seller_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Phone (+254...)</label>
                  <input
                    required
                    value={formData.seller_phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seller_phone: e.target.value }))}
                    placeholder="07xx xxx xxx or +254..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Product Name</label>
                  <input
                    required
                    value={formData.product_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Category</label>
                  <input
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Price (KES)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Condition</label>
                  <input
                    required
                    value={formData.condition}
                    onChange={(e) => setFormData((prev) => ({ ...prev, condition: e.target.value }))}
                    placeholder="e.g. New, Gently used"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Description</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-gray-400 resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Product Images (up to 5, max 5MB each)
                  </label>
                  <label className="w-full border border-dashed border-gray-300 rounded-xl bg-gray-50 px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">Choose images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>

                  {formData.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.images.map((file) => (
                        <span
                          key={`${file.name}-${file.size}`}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium disabled:opacity-70"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
                Submit & Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellPage;
