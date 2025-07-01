"use client"

import type React from "react"
import { useState } from "react"

export function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    isVolunteer: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleToggle = () => {
    setForm({ ...form, isVolunteer: !form.isVolunteer })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Logging in:", form)
    window.location.href = "/"
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 fixed inset-0"
      style={{ backgroundImage: "url('/images/bg2.jpg')" }}
    >
      <div className="bg-white/90 shadow-lg rounded-2xl p-10 w-full max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Toggle Switch */}
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-800 font-medium">Login as</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Volunteer</span>
              <input
                type="checkbox"
                checked={form.isVolunteer}
                onChange={handleToggle}
                className="accent-teal-600 w-5 h-5"
              />
            </div>
          </div>

          {/* Form Fields */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Login as {form.isVolunteer ? "Volunteer" : "Admin"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-teal-600 hover:underline">
            Forgot your password?
          </a>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-teal-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
