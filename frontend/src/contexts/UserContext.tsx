// contexts/UserContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  phone: string
  created_at?: string
}

interface UserContextType {
  user: User | null
  userId: number | null
  isAuthenticated: boolean
  login: (userData: User, userId: number) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUserId = localStorage.getItem('user_id')
    const storedUserData = localStorage.getItem('user_data')

    if (storedUserId && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        setUser(userData)
        setUserId(parseInt(storedUserId))
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_data')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User, userIdParam: number) => {
    setUser(userData)
    setUserId(userIdParam)
    localStorage.setItem('user_id', userIdParam.toString())
    localStorage.setItem('user_data', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setUserId(null)
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_data')
    window.location.href = '/login'
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
    }
  }

  const value: UserContextType = {
    user,
    userId,
    isAuthenticated: !!user && !!userId,
    login,
    logout,
    updateUser,
    loading
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// utils/auth.ts
export const getUserId = (): number | null => {
  if (typeof window === 'undefined') return null
  
  const storedUserId = localStorage.getItem('user_id')
  return storedUserId ? parseInt(storedUserId) : null
}

export const getUserData = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const storedUserData = localStorage.getItem('user_data')
  if (storedUserData) {
    try {
      return JSON.parse(storedUserData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
  return null
}

export const isAuthenticated = (): boolean => {
  return !!(getUserId() && getUserData())
}

export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login'
    return false
  }
  return true
}

// API helper functions
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const userId = getUserId()
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Add user ID to headers if authenticated
  if (userId) {
    defaultHeaders['X-User-ID'] = userId.toString()
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`http://localhost:5000${endpoint}`, config)
    
    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
      throw new Error('Authentication required')
    }

    return response
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Higher-order component for protected routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useUser()

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      window.location.href = '/login'
      return null
    }

    return <Component {...props} />
  }
}