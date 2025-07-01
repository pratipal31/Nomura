/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from "react"

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...')
        
        // Store user data in localStorage
        localStorage.setItem('user_id', data.user_id.toString())
        localStorage.setItem('user_data', JSON.stringify(data.user))
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-800 font-medium">Register as Volunteer</label>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

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
            type="tel"
            name="phone"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
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
            {loading ? 'Registering...' : 'Register as Volunteer'}
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}