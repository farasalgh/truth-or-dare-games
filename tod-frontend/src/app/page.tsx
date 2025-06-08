"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E6CCB2] via-[#DDB892] to-[#B08968] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Dice */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10"
        >
          <svg
            className="w-24 h-24 text-white/10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-5 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        </motion.div>

        {/* Floating Cards */}
        <motion.div
          animate={{ y: [-10, 10], rotate: [3, -3] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          className="absolute top-40 right-20"
        >
          <div className="relative w-32 h-48 rounded-2xl shadow-xl ring-1 ring-white/10 bg-white/5 backdrop-blur-md border border-white/20 p-4">
            {/* Corner Text */}
            <div className="absolute top-2 left-2 text-white/40 text-sm">
              T🃏
            </div>
            <div className="absolute bottom-2 right-2 text-white/40 text-sm rotate-180">
              T🃏
            </div>

            {/* Middle Content */}
            <div className="flex flex-col items-center justify-center h-full text-white text-center space-y-2">
              <div className="text-lg font-bold">Truth</div>
              <div className="text-xs text-white/60">
                What’s your biggest fear?
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Circles */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
            <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-[Cinzel]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            >
            Truth or Dare
            </motion.h1>
          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Permainan klasik yang menghibur dengan pertanyaan dan tantangan
            seru. Mainkan bersama teman-temanmu dan buat momen yang tak
            terlupakan!
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl shadow-lg hover:bg-white/30 transition-all relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative font-medium text-lg">
                Masuk ke Game
              </span>
            </motion.button>
          </Link>

          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-[#B08968]/25 transition-all relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative font-medium text-lg">
                Daftar Sekarang
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature Cards Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Online Gaming Card */}
          <motion.div
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 10,
              boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#B08968]/20 via-[#E6CCB2]/20 to-transparent"
              animate={{ x: ["-100%", "100%"], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10">
              <motion.div
                animate={{
                  y: [0, -10, 5, -5, 0],
                  x: [0, 5, -5, 10, 0],
                  rotate: [0, 15, -15, 5, 0],
                  scale: [1, 1.2, 0.9, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="text-4xl mb-4 inline-block"
              >
                🎮
              </motion.div>
              <motion.h3
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-white mb-2 group-hover:text-[#E6CCB2] transition-all duration-300"
              >
                Bermain Online
              </motion.h3>
              <motion.p
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                className="text-white/70 transition-all duration-300"
              >
                Mainkan kapan saja dan dimana saja bersama teman-temanmu
              </motion.p>
            </div>
          </motion.div>

          {/* Questions Card */}
          <motion.div
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: -10,
              boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#DDB892]/20 via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: 1,
              }}
            />
            <div className="relative z-10">
              <motion.div
                animate={{
                  rotate: [0, 360, 270, 180, 90, 0],
                  scale: [1, 1.3, 0.8, 1.2, 0.9, 1],
                  y: [0, -8, 4, -6, 2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "anticipate",
                }}
                className="text-4xl mb-4 inline-block"
              >
                💫
              </motion.div>
              <motion.h3
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-white mb-2 group-hover:text-[#DDB892] transition-all duration-300"
              >
                Pertanyaan Seru
              </motion.h3>
              <motion.p
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                className="text-white/70 transition-all duration-300"
              >
                Ribuan pertanyaan dan tantangan yang menarik dan menghibur
              </motion.p>
            </div>
          </motion.div>

          {/* Multiplayer Card */}
          <motion.div
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 10,
              boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#7F5539]/20 via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: 2,
              }}
            />
            <div className="relative z-10">
              <motion.div
                animate={{
                  scale: [1, 1.4, 0.8, 1.2, 1],
                  rotate: [0, 20, -20, 10, 0],
                  x: [0, 10, -10, 5, 0],
                  y: [0, -5, 5, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeOut",
                }}
                className="text-4xl mb-4 inline-block"
              >
                👥
              </motion.div>
              <motion.h3
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-white mb-2 group-hover:text-[#7F5539] transition-all duration-300"
              >
                Multiplayer
              </motion.h3>
              <motion.p
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                className="text-white/70 transition-all duration-300"
              >
                Ajak teman sebanyak mungkin untuk bermain bersama
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
