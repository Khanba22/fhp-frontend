"use client"

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    authToken: string | null;
    setAuthToken: (token: string) => void;  
    error: string | null;
    setError: (error: string | null) => void;
    isAuthenticating: boolean;
    setIsAuthenticating: (isAuthenticating: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            setAuthToken(token)
        }else{
            setAuthToken(null)
        }
        setIsAuthenticating(false)
        setError(null)
    }, [])

    const login = () => {
        setIsAuthenticating(true)
        localStorage.setItem('authToken', '1234567890')
    }

    useEffect(() => {
        if (authToken) {
            router.push('/')
        }else{
            router.push('/auth')
        }
    }, [authToken, router])

    const logout = () => {
        setAuthToken(null)
        localStorage.removeItem('authToken')
    }

    const value = {
            isAuthenticated: !!authToken,
        login,
        logout,
        authToken,
        setAuthToken,
        error,
        setError,
        isAuthenticating,
        setIsAuthenticating,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}