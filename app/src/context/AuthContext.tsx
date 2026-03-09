import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
    role: 'parent',
    toggleRole: () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState('parent');

    const toggleRole = () => {
        setRole(r => r === 'parent' ? 'teacher' : 'parent');
    };

    return (
        <AuthContext.Provider value={{ role, toggleRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
