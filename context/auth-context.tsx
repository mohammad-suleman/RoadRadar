"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

type User = {
  id: string
  name: string | null
  email: string | null
  photoURL?: string | null
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  googleAuth: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true)
      if (firebaseUser) {
        // User is signed in
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        }
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        // User is signed out
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/detection-dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await updateProfile(user, { displayName: name }) // Save the user's name
      await signOut(auth) // Log out the user after sign-up
    } catch (error) {
      throw error
    }
  }

  const googleAuth = async () => {
    try {
      setIsLoading(true)

      // Create a new provider instance each time to avoid any cached state issues
      const provider = new GoogleAuthProvider()
      provider.addScope("profile")
      provider.addScope("email")

      // Use signInWithPopup with the new provider
      const result = await signInWithPopup(auth, provider)

      // The signed-in user info
      const user = result.user
      console.log("Google sign-in successful:", user.displayName)

      router.push("/detection-dashboard")
    } catch (error: any) {
      console.error("Google auth error:", error)

      // Log detailed error information
      if (error.code) console.error("Error code:", error.code)
      if (error.message) console.error("Error message:", error.message)
      if (error.email) console.error("Email:", error.email)
      if (error.credential) console.error("Credential type:", typeof error.credential)

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signUp, googleAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

