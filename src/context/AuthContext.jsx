import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
    user: null,
    session: null,
    loading: true,
    signUp: () => { },
    signIn: () => { },
    signOut: () => { },
    isAdmin: false,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check for active session on load
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session:", error.message);
            }
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setIsAdmin(currentUser?.email === 'officialsihul@gmail.com' || currentUser?.user_metadata?.role === 'admin');
            setLoading(false);
        };

        getInitialSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setIsAdmin(currentUser?.email === 'officialsihul@gmail.com' || currentUser?.user_metadata?.role === 'admin');
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signUp = (email, password, options = {}) => {
        return supabase.auth.signUp({
            email,
            password,
            options: {
                ...options,
                emailRedirectTo: `${window.location.origin}/login`
            }
        });
    };

    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = () => {
        return supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
