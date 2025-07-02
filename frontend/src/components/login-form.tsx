/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from "react"

export function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user_id', data.user_id.toString())
        localStorage.setItem('user_data', JSON.stringify(data.user))
        
        // Redirect to home page
        window.location.href = "/"
      } else {
        setError(data.error || 'Login failed')
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-800 font-medium">Login as Volunteer</label>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login as Volunteer'}
          </button>
        </div>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-teal-600 hover:underline">
            Forgot your password?
          </a>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-teal-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}