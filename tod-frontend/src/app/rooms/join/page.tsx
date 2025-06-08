"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { motion } from "framer-motion";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await API.post("/rooms/join", { code });
      router.push(`/rooms/${code}`);
    } catch (error: any) {
      setErr(error.response?.data?.error || "Kode room tidak ditemukan.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6CCB2] via-[#DDB892] to-[#B08968] p-6 relative overflow-hidden">
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

      {/* Back Navigation */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/dashboard')}
        className="fixed top-4 left-4 z-50 bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
      >
        <span>←</span>
        <span>Kembali</span>
      </motion.button>

      <div className="w-full max-w-md mx-auto mt-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <form onSubmit={handleJoin} className="flex flex-col gap-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-r from-[#DDB892] to-[#B08968] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative group"
              >
                <span className="text-3xl group-hover:animate-spin transition-all duration-500">🎮</span>
                <motion.div
                  className="absolute -inset-1 bg-white/20 rounded-full blur"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Gabung Room</h2>
              <p className="text-white/80">Masukkan kode room untuk bergabung</p>
            </div>

            <div className="space-y-4">
              <motion.div whileTap={{ scale: 0.99 }} className="relative">
                <input
                  placeholder="Masukkan Kode Room"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08968] backdrop-blur-sm transition-all"
                  style={{ letterSpacing: "0.2em" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                  animate={{ 
                    x: [-200, 200],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/20 backdrop-blur-md text-white py-3 px-6 rounded-xl shadow-lg hover:bg-white/30 transition-all duration-200 font-medium relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ 
                    x: [-200, 200],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <span>✨Gabung Sekarang</span>
                </span>
              </motion.button>
            </div>

            {err && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/80 text-center bg-red-500/20 backdrop-blur-md py-2 px-4 rounded-lg"
              >
                ❌ {err}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}