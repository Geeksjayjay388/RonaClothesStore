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
    const [profile, setProfile] = useState(null);

    const fetchProfile = async (userId) => {
        if (!userId) {
            setProfile(null);
            return;
        }
        console.log("Fetching profile for user:", userId);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
        } else {
            console.log("Profile fetched successfully:", data);
            setProfile(data);
        }
    };

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
            if (currentUser) fetchProfile(currentUser.id);
            setLoading(false);
        };

        getInitialSession();

        // Listen for changes on auth state
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setSession(session);
            setUser(currentUser);
            setIsAdmin(currentUser?.email === 'officialsihul@gmail.com' || currentUser?.user_metadata?.role === 'admin');

            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        // Realtime Profile Sync
        let profileSubscription = null;

        const setupProfileSubscription = (userId) => {
            if (profileSubscription) profileSubscription.unsubscribe();

            profileSubscription = supabase
                .channel(`public:profiles:id=eq.${userId}`)
                .on('postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
                    (payload) => {
                        console.log("Realtime profile update received:", payload.new);
                        setProfile(payload.new);
                    }
                )
                .subscribe((status) => {
                    console.log(`Profile subscription status for ${userId}:`, status);
                });
        };

        // Initialize subscription if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setupProfileSubscription(session.user.id);
        });

        // Update subscription on auth changes
        const { data: { subscription: authSubForProfile } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setupProfileSubscription(session.user.id);
            } else {
                if (profileSubscription) profileSubscription.unsubscribe();
                profileSubscription = null;
            }
        });

        return () => {
            authSubscription.unsubscribe();
            authSubForProfile.unsubscribe();
            if (profileSubscription) profileSubscription.unsubscribe();
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
        profile,
        refreshProfile: () => user && fetchProfile(user.id),
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
