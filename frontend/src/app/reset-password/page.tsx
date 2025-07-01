"use client"

import React, { useState, useEffect } from "react"

export function ResetPassword() {
  const [form, setForm] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      setForm(prev => ({ ...prev, token }))
    } else {
      setError("Invalid reset link")
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async () => {
    if (!form.password || !form.confirmPassword) {
      setError("Both password fields are required")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 fixed inset-0"
      style={{ backgroundImage: "url('/images/bg2.jpg')" }}
    >
      <div className="bg-white/90 shadow-lg rounded-2xl p-10 w-full max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Reset Password</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="password"
            name="password"
            placeholder="New Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !form.token}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>

        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-teal-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}