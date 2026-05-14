import React, { createContext, useState, useContext } from 'react';

/**
 * Global Authentication Context
 * 
 * Manages the top-level application state determining which Navigational Stack
 * (Parent or Teacher) is rendered. Currently implements a simplified mock-auth
 * flow for prototyping purposes (bypassing formal Supabase JWT exchanges).
 */
interface AuthContextType {
    role: string | null;
    toggleRole: () => void;
    loginAs: (role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    role: null,
    toggleRole: () => { },
    loginAs: () => { },
    logout: () => { }
});

/**
 * Wrapper component to inject the centralized role-state into the React Tree.
 * Wrap the root `<AppNavigator>` with this provider to enable deep-linking 
 * and context hooks from any arbitrarily nested screen.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<string | null>(null);

    // Development Utility: Hot-swaps the UI between Parent and Teacher without re-authenticating
    const toggleRole = () => {
        setRole(r => r === 'parent' ? 'teacher' : 'parent');
    };

    const loginAs = (r: string) => setRole(r);
    const logout = () => setRole(null);

    return (
        <AuthContext.Provider value={{ role, toggleRole, loginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom React Hook to consume the AuthContext.
 * Guaranteed to return the current `role` and mutator functions.
 */
export function useAuth() {
    return useContext(AuthContext);
}
