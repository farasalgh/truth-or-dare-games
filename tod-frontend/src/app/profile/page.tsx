"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";


export default function ProfilePage() {
  const { user, token, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | null>(null);
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await API.put(
        "/auth/profile",
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
      }
      setMsg({ text: "Berhasil update profil.", type: 'success' });
    } catch (err: any) {
      setMsg({
        text: err.response?.data?.error || "Gagal update profil.",
        type: 'error'
      });
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPassword !== newPassword2) {
      setMsg({ text: "Password baru tidak sama.", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await API.put(
        "/auth/profile",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg({ text: "Berhasil ganti password.", type: 'success' });
      setOldPassword("");
      setNewPassword("");
      setNewPassword2("");
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
      }
    } catch (err: any) {
      setMsg({
        text: err.response?.data?.error || "Gagal ganti password.",
        type: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6CCB2] via-[#DDB892] to-[#B08968] p-6">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg mt-16"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Pengaturan Profil</h1>

          {/* Profile Section */}
          <motion.div className="mb-4">
            <motion.button
              onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
              className="w-full bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-lg hover:bg-white/30 transition-all flex items-center justify-between"
            >
              <span className="font-medium">Informasi Profil</span>
              <span className="transform transition-transform duration-200">
                {activeSection === 'profile' ? '▼' : '▶'}
              </span>
            </motion.button>

            <AnimatePresence>
              {activeSection === 'profile' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 mt-4 p-4 bg-white/5 rounded-xl">
                    <div className="space-y-2">
                      <label className="block text-white/90">Username</label>
                      <input
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white/90">Email</label>
                      <input
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white py-2 px-6 rounded-lg shadow-lg hover:shadow-[#B08968]/25 transition-all relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="relative">
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Section */}
          <motion.div className="mb-4">
            <motion.button
              onClick={() => setActiveSection(activeSection === 'password' ? null : 'password')}
              className="w-full bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-lg hover:bg-white/30 transition-all flex items-center justify-between"
            >
              <span className="font-medium">Ganti Password</span>
              <span className="transform transition-transform duration-200">
                {activeSection === 'password' ? '▼' : '▶'}
              </span>
            </motion.button>

            <AnimatePresence>
              {activeSection === 'password' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mt-4 p-4 bg-white/5 rounded-xl">
                    <div className="space-y-2">
                      <label className="block text-white/90">Password Lama</label>
                      <input
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        required
                        type="password"
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white/90">Password Baru</label>
                      <input
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        type="password"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white/90">Ulangi Password Baru</label>
                      <input
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40"
                        value={newPassword2}
                        onChange={e => setNewPassword2(e.target.value)}
                        required
                        type="password"
                        autoComplete="new-password"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white py-2 px-6 rounded-lg shadow-lg hover:shadow-[#B08968]/25 transition-all relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="relative">
                        {loading ? "Menyimpan..." : "Ganti Password"}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Message Display */}
          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-lg text-center mt-4 backdrop-blur-md ${
                  msg.type === 'success' 
                    ? 'bg-green-500/20 text-white'
                    : 'bg-red-500/20 text-white'
                }`}
              >
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}