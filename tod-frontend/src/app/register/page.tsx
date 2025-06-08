"use client";
import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await API.post("/auth/register", form);
      router.push("/login");
    } catch (error: any) {
      setErr(error.response?.data?.error || "Gagal register");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EBE0] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D5BDAF] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3D5CA] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#DDB892] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 relative"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-r from-[#DDB892] to-[#B08968] rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-3xl">✨</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-[#7F5539] mb-2">Create Account</h1>
          <p className="text-[#9C6644]/80">Join us and start playing!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              name="username"
              required
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#DDB892] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent transition-all placeholder:text-[#9C6644]/50"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#DDB892] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent transition-all placeholder:text-[#9C6644]/50"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#DDB892] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent transition-all placeholder:text-[#9C6644]/50"
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-[#B08968]/25 transition-all duration-200"
          >
            Register
          </motion.button>

          {err && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center"
            >
              {err}
            </motion.div>
          )}

          <div className="text-center mt-6">
            <Link 
              href="/login"
              className="text-[#9C6644]/80 hover:text-[#7F5539] transition-colors"
            >
              Already have an account? Login here
            </Link>
          </div>
        </form>
      </motion.main>
    </div>
  );
}