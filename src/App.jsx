import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import StorePage from "./pages/StorePage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ContactPage from "./pages/ContactPage";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import PrivacyBanner from "./components/PrivacyBanner";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import HeroImage from "./assets/hero.png";
import LoginBg from "./assets/login-bg.png";

const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Prefetch key images
    const imagesToLoad = [HeroImage, LoginBg];
    let loadedCount = 0;

    if (imagesToLoad.length === 0) {
      setImagesLoaded(true);
      return;
    }

    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // Continue even if an image fails
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  const isLoading = authLoading || !imagesLoaded;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="overflow-x-hidden min-h-screen">
        <Toaster position="bottom-right" />
        <PrivacyBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
