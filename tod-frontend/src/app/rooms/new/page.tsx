"use client";
import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type RoomResponse = {
  id: number;
  code: string;
  isActive: boolean;
  createdAt: string;
};

export default function NewRoom() {
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { data } = await API.post("/rooms", {});
      setRoom(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Gagal membuat room.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToRoom = () => {
    if (room) router.push(`/rooms/${room.code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6CCB2] via-[#DDB892] to-[#B08968] p-6 relative overflow-hidden">
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
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-r from-[#DDB892] to-[#B08968] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-3xl">🎲</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Buat Room Baru</h2>
            <p className="text-white/80 mb-8">Buat room dan ajak teman bermain!</p>
          </div>

          {!room ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-md text-white py-3 px-8 rounded-xl shadow-lg hover:bg-white/30 transition-all duration-200 font-medium disabled:opacity-50 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: [-500, 500] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                {isLoading ? (
                  <div className="flex items-center gap-2 relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Membuat Room...</span>
                  </div>
                ) : (
                  <span className="relative">✨ Buat Room</span>
                )}
              </motion.button>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-white/80 text-center bg-red-500/20 backdrop-blur-md py-2 px-4 rounded-lg"
                >
                  ❌ {error}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 border border-white/30 p-6 rounded-xl flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, times: [0, 0.5, 1] }}
                className="text-white text-5xl mb-4"
              >
                ✅
              </motion.div>
              <p className="text-white font-semibold mb-2">Room berhasil dibuat!</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 py-3 px-6 rounded-lg my-4 group cursor-pointer"
              >
                <p className="text-4xl font-mono tracking-[0.3em] text-white group-hover:text-white/90 transition-colors">
                  {room.code}
                </p>
              </motion.div>
              <p className="text-white/80 text-sm mb-6">Bagikan kode ini ke temanmu untuk bergabung</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToRoom}
                className="w-full bg-white/20 backdrop-blur-md text-white py-3 px-6 rounded-xl shadow-lg hover:bg-white/30 transition-all duration-200 font-medium relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: [-500, 500] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative">🎮 Masuk ke Room</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}