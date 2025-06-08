"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E6CCB2] via-[#DDB892] to-[#B08968] p-6 relative overflow-hidden">
      {/* Decorative SVG Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dice SVG */}
        <motion.svg
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-24 h-24 text-white/10"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-5 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </motion.svg>

        {/* Game Controller SVG */}
        <motion.svg
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-32 h-32 text-white/10"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </motion.svg>
      </div>

      {/* Floating Navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 right-4 z-50 flex gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/profile")}
          className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
        >
          <span>👤</span>
          <span>Profile</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
        >
          <span>👋</span>
          <span>Logout</span>
        </motion.button>
      </motion.div>

      <div className="max-w-lg mx-auto mt-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20"
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/20 relative group"
            >
              <span className="text-5xl group-hover:animate-spin transition-all duration-500">🎮</span>
              <motion.div
                className="absolute -inset-1 bg-white/20 rounded-full blur"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <h2 className="text-4xl font-bold mb-1 text-white">{user.username}</h2>
            <p className="text-white/80 mb-8">Selamat datang di Truth or Dare Game!</p>
          </motion.div>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/rooms/new")}
              className="bg-white/20 backdrop-blur-md text-white py-4 px-6 rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-200 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{ x: [-500, 500] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-lg font-medium">Buat Room Baru</span>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl"
                >
                  →
                </motion.div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/rooms/join")}
              className="bg-white/20 backdrop-blur-md text-white py-4 px-6 rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-200 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{ x: [-500, 500] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <span className="text-lg font-medium">Gabung Room</span>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="text-xl"
                >
                  →
                </motion.div>
              </div>
            </motion.button>
          </div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white/60 text-sm">
              Made with 🎲 by Tod Games Team
            </span>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}