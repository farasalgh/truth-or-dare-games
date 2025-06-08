"use client";
import { useEffect, useRef, useState } from "react";
import API from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

type Question = { id: number; content: string; type: string };
type ChatMsg = { user: string; text: string; system?: boolean };

type GameState = {
  currentQuestion: Question | null;
  currentPlayer: string | null;
  players: string[];
  type: "truth" | "dare";
};

const SOCKET_URL = "http://localhost:3000";

export default function RoomGame() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [type, setType] = useState<"truth" | "dare">("truth");
  const [chats, setChats] = useState<ChatMsg[]>([]);
  const [msg, setMsg] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const [direction, setDirection] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    currentPlayer: null,
    players: [],
    type: "truth",
  });

  const cardVariants = {
    initial: {
      rotateY: 180,
      scale: 0.8,
      opacity: 0,
    },
    animate: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      rotateY: -180,
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Socket.io setup
  useEffect(() => {
    if (!user) return;
    const socket = io(SOCKET_URL, {
      query: { room: code, username: user.username },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_room", { roomCode: code, user });

    socket.on("game_state_update", (newState: GameState) => {
      setGameState(newState);
      setQuestion(newState.currentQuestion);
      setType(newState.type);
      setIsFlipped(true);
    });

    socket.on("player_join", (data) => {
      setChats((prev) => [
        ...prev,
        {
          user: "System",
          text: `${data.username} bergabung ke room.`,
          system: true,
        },
      ]);
      setGameState((prev) => ({
        ...prev,
        players: [...prev.players, data.username],
      }));
    });

    socket.on("player_leave", (data) => {
      setChats((prev) => [
        ...prev,
        {
          user: "System",
          text: `${data.username} keluar dari room.`,
          system: true,
        },
      ]);
      setGameState((prev) => ({
        ...prev,
        players: prev.players.filter((p) => p !== data.username),
      }));
    });

    socket.on("chat_message", (data) => {
      setChats((prev) => [...prev, { user: data.username, text: data.text }]);
    });

    setChats((c) => [
      ...c,
      { user: "System", text: `Kamu bergabung ke room ${code}.`, system: true },
    ]);

    return () => {
      socket.emit("leave_room", { roomCode: code, user });
      socket.disconnect();
    };
  }, [code, user]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    socketRef.current?.emit("chat_message", {
      roomCode: code,
      user,
      message: msg,
    });
    setMsg("");
  };

  const handleLeave = () => {
    socketRef.current?.emit("leave_room", { roomCode: code, user });
    router.push("/dashboard");
  };

  const fetchQuestion = async () => {
    if (gameState.currentPlayer !== user?.username) {
      setChats((prev) => [
        ...prev,
        {
          user: "System",
          text: "Bukan giliranmu! Sekarang giliran " + gameState.currentPlayer,
          system: true,
        },
      ]);
      return;
    }

    setIsFlipped(false);
    try {
      const { data } = await API.get(`/questions/random?type=${type}`);
      socketRef.current?.emit("new_question", {
        roomCode: code,
        question: data,
        type,
        username: user?.username,
      });
    } catch (error) {
      setChats((prev) => [
        ...prev,
        {
          user: "System",
          text: "Gagal mengambil pertanyaan",
          system: true,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6CCB2] via-[#DDB892] to-[#B08968] p-6">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {/* Header with Players */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Room: {code}</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeave}
              className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg hover:bg-white/30 transition-all"
            >
              🚪 Keluar Game
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            {gameState.players.map((player) => (
              <motion.div
                key={player}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-4 py-2 rounded-lg ${
                  gameState.currentPlayer === player
                    ? "bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white font-bold"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {player} {gameState.currentPlayer === player && "🎲"}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg"
        >
          <div className="flex gap-4 mb-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setType("truth")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                type === "truth"
                  ? "bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white shadow-lg"
                  : "bg-white/20 text-white"
              }`}
              disabled={gameState.currentPlayer !== user?.username}
            >
              🤔 Truth
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setType("dare")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                type === "dare"
                  ? "bg-gradient-to-r from-[#7F5539] to-[#B08968] text-white shadow-lg"
                  : "bg-white/20 text-white"
              }`}
              disabled={gameState.currentPlayer !== user?.username}
            >
              🎯 Dare
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchQuestion}
            disabled={gameState.currentPlayer !== user?.username}
            className={`w-full py-3 px-6 rounded-lg shadow-lg transition-all mb-6 ${
              gameState.currentPlayer === user?.username
                ? "bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white hover:shadow-[#B08968]/25"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            }`}
          >
            🎲{" "}
            {gameState.currentPlayer === user?.username
              ? "Ambil Kartu"
              : `Giliran ${gameState.currentPlayer}`}
          </motion.button>

          <div className="perspective-1000 w-4/5 mx-auto">
            <AnimatePresence mode="wait">
              {question && (
                <motion.div
                  key={question.id}
                  variants={cardVariants}
                  initial="initial"
                  animate={isFlipped ? "animate" : "initial"}
                  exit="exit"
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="relative w-full aspect-[2.5/3.5] preserve-3d" // Standard playing card ratio
                >
                  {/* Card Front */}
                  <div className="absolute inset-0 backface-hidden">
                    <div
                      className="w-full h-full rounded-lg shadow-xl bg-white p-6"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #fff 25%, #f0f0f0 25%, #f0f0f0 50%, #fff 50%, #fff 75%, #f0f0f0 75%, #f0f0f0)",
                        backgroundSize: "4px 4px",
                        border: "1px solid #000",
                        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div className="h-full flex flex-col">
                        {/* Top corner */}
                        <div className="absolute top-3 left-3 flex flex-col items-center">
                          <span
                            className="text-2xl font-bold"
                            style={{
                              color: type === "truth" ? "#2B50AA" : "#CC0000",
                            }}
                          >
                            {type === "truth" ? "T" : "D"}
                          </span>
                          <span
                            className="text-2xl"
                            style={{
                              color: type === "truth" ? "#2B50AA" : "#CC0000",
                            }}
                          >
                            {type === "truth" ? "♠" : "♥"}
                          </span>
                        </div>

                        {/* Center pattern */}
                        <div
                          className="absolute inset-12 border-4 border-double rounded"
                          style={{
                            borderColor:
                              type === "truth" ? "#2B50AA" : "#CC0000",
                          }}
                        >
                          <div className="h-full flex items-center justify-center p-4">
                            <div className="text-center">
                              <h3
                                className="text-xl font-serif mb-3"
                                style={{
                                  color:
                                    type === "truth" ? "#2B50AA" : "#CC0000",
                                }}
                              >
                                {type.toUpperCase()}
                              </h3>
                              <p className="text-gray-800 text-sm leading-relaxed font-serif">
                                {question.content}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom corner (rotated) */}
                        <div className="absolute bottom-3 right-3 flex flex-col items-center transform rotate-180">
                          <span
                            className="text-2xl font-bold"
                            style={{
                              color: type === "truth" ? "#2B50AA" : "#CC0000",
                            }}
                          >
                            {type === "truth" ? "T" : "D"}
                          </span>
                          <span
                            className="text-2xl"
                            style={{
                              color: type === "truth" ? "#2B50AA" : "#CC0000",
                            }}
                          >
                            {type === "truth" ? "♠" : "♥"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div
                      className="w-full h-full rounded-lg bg-white"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 2px, #fff 2px, #fff 12px)",
                        border: "1px solid #000",
                        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="w-4/5 h-4/5 rounded-lg"
                          style={{
                            background: "white",
                            border: "2px solid #CC0000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span className="text-5xl">🎮</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg"
        >
          <div className="h-64 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {chats.map((c, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={`p-2 rounded-lg ${
                    c.system
                      ? "bg-[#B08968]/10 text-[#E6CCB2] italic text-sm"
                      : "bg-white/5"
                  }`}
                >
                  {!c.system && (
                    <span className="font-bold text-white/90">{c.user}: </span>
                  )}
                  <span className="text-white/80">{c.text}</span>
                </motion.div>
              ))}
              <div ref={chatBottomRef}></div>
            </div>
            <form onSubmit={sendMsg} className="flex gap-2">
              <input
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:border-white/30"
                placeholder="Ketik pesan..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-[#B08968] to-[#7F5539] text-white px-6 rounded-lg shadow-lg hover:shadow-[#B08968]/25 transition-all"
              >
                📨 Kirim
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
