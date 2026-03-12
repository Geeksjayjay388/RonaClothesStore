import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import LoginBg from "../assets/login-bg.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profile";

    const { signIn, user } = useAuth();

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (user) {
            const isAdmin = user.email === 'officialsihul@gmail.com' || user.user_metadata?.role === 'admin';
            navigate(isAdmin ? "/admin" : from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting login for:", trimmedEmail);
            const { data, error } = await signIn(trimmedEmail, password);
            if (error) throw error;

            toast.success("Welcome to Elementra.");

            // Redirection is handled by the useEffect above
        } catch (error) {
            toast.error(error.message || "Invalid email or password");
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex font-sans bg-white overflow-hidden">
            {/* Left Side: Dynamic Image Area */}
            <div
                className="hidden lg:block lg:w-1/2 bg-gray-900 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url(${LoginBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>

                <div className="absolute bottom-16 left-16 right-16">
                    <span className="font-bold tracking-[0.3em] uppercase text-xs mb-4 block text-red-400">Curated Excellence</span>
                    <h2 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                        The <br /> Collective.
                    </h2>
                    <p className="text-gray-300 max-w-md text-lg leading-relaxed">
                        Access your curated wardrobe, track recent acquisitions, and manage your personal style profile within the Rona archive.
                    </p>
                </div>
            </div>

            {/* Right Side: Navigation & Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
                {/* Header/Nav Area */}
                <div className="p-8 flex justify-between items-center">
                    <Link to="/" className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Archive
                    </Link>
                    <div className="text-xl font-black tracking-tighter italic">RONA.</div>
                </div>

                {/* Form Container */}
                <div className="flex-grow flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-md space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Sign In.</h1>
                            <p className="text-gray-500 font-medium">Enter your credentials to access the archive.</p>
                        </div>

                        <form className="space-y-10" onSubmit={handleLogin}>
                            <div className="space-y-8">
                                {/* Email Field */}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="login-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors peer text-gray-900 placeholder-transparent"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    <label
                                        htmlFor="login-email"
                                        className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:uppercase peer-focus:tracking-widest cursor-text"
                                    >
                                        Email Address
                                    </label>
                                </div>

                                {/* Password Field */}
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="login-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors peer text-gray-900 placeholder-transparent pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <label
                                        htmlFor="login-password"
                                        className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:uppercase peer-focus:tracking-widest cursor-text"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-4 text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white rounded-none py-5 font-bold tracking-widest uppercase hover:bg-black transition-colors mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 size={20} className="animate-spin" />}
                                {loading ? "Authenticating..." : "Sign In to Rona"}
                            </button>
                        </form>

                        <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                            <Link to="/signup" className="text-center text-sm font-bold text-gray-500 hover:text-red-600 transition-colors tracking-tight">
                                Don't have an account? <span className="text-gray-900">Join the collective</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;