import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail || !password || !firstName) {
            toast.error("Please fill in all required fields (Name, Email, Password)");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            console.log("Creating account for:", trimmedEmail);
            const { error } = await signUp(trimmedEmail, password, {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: 'user' // Default role
                }
            });

            if (error) throw error;

            toast.success("Account created! Welcome to the Archive.");
            toast.success("Please sign in to continue.");
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "An error occurred during registration");
            console.error("SignUp Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex font-sans bg-white overflow-hidden">
            {/* Left Side: Background Area */}
            <div
                className="hidden lg:block lg:w-1/2 bg-gray-900 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: "url('/src/assets/login-bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>

                <div className="absolute bottom-16 left-16 right-16">
                    <span className="font-bold tracking-[0.3em] uppercase text-xs mb-4 block text-red-400">Join The Collective</span>
                    <h2 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                        Unlock <br /> The Archive.
                    </h2>
                    <p className="text-gray-300 max-w-md text-lg leading-relaxed">
                        Create an account to track your orders, save your favorite pieces, and receive exclusive access to our newest curations.
                    </p>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
                <div className="p-8 flex justify-between items-center">
                    <Link to="/login" className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                    </Link>
                    <div className="text-xl font-black tracking-tighter italic">RONA.</div>
                </div>

                <div className="flex-grow flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-md space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Sign Up.</h1>
                            <p className="text-gray-500 font-medium">Join the archive and curate your excellence.</p>
                        </div>

                        <form className="space-y-10" onSubmit={handleSignUp}>
                            {/* Personal Name Info */}
                            <div className="flex gap-6">
                                <div className="w-1/2 relative group">
                                    <input
                                        type="text"
                                        id="signup-first"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors peer text-gray-900 placeholder-transparent"
                                        placeholder="Jane"
                                        required
                                    />
                                    <label htmlFor="signup-first" className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:uppercase peer-focus:tracking-widest cursor-text">
                                        First Name
                                    </label>
                                </div>
                                <div className="w-1/2 relative group">
                                    <input
                                        type="text"
                                        id="signup-last"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors peer text-gray-900 placeholder-transparent"
                                        placeholder="Doe"
                                    />
                                    <label htmlFor="signup-last" className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:uppercase peer-focus:tracking-widest cursor-text">
                                        Last Name
                                    </label>
                                </div>
                            </div>

                            {/* Email and Password Info */}
                            <div className="space-y-10">
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="signup-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors peer text-gray-900 placeholder-transparent"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    <label htmlFor="signup-email" className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:uppercase peer-focus:tracking-widest cursor-text">
                                        Email Address
                                    </label>
                                </div>

                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="signup-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors peer text-gray-900 placeholder-transparent pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <label htmlFor="signup-password" className="absolute left-0 -top-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:uppercase peer-focus:tracking-widest cursor-text">
                                        Create Password
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
                                className="w-full bg-gray-900 text-white rounded-none py-5 font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 size={20} className="animate-spin" />}
                                {loading ? "Creating Account..." : "Join the Archive"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 pt-6 font-medium">
                            Already a member? <Link to="/login" className="font-bold text-gray-900 hover:text-red-600 transition-colors tracking-tight">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;