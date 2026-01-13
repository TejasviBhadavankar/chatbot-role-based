import { useEffect, useState, useContext, useRef } from "react";
import { sendMessage, getHistory } from "../api/chat.api.js";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Plus,
  Trash2,
  LogOut,
  Menu,
  X,
  Send,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/UseThemeStore.jsx";
import ThemeButton from "../components/ThemeButton.jsx";
import chatbotIcon from "../assets/chatbot.png";

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substring(2);

const ChatBox = () => {
  const [conversations, setConversations] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const theme = useThemeStore((state) => state.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeId, typing]);

  const loadHistory = async () => {
    try {
      const res = await getHistory();
      const grouped = {};

      res.data.forEach((c) => {
        if (!grouped[c.conversationId]) grouped[c.conversationId] = [];
        grouped[c.conversationId].push(c);
      });

      setConversations(grouped);
      const ids = Object.keys(grouped);
      if (ids.length) setActiveId(ids[ids.length - 1]);
    } catch {}
  };

  const newChat = () => {
    const id = generateId();
    setConversations((prev) => ({
      ...prev,
      [id]: [
        {
          _id: "welcome",
          response: "Hi! How can I help you today?",
        },
      ],
    }));
    setActiveId(id);
    setMsg("");
    setShowSidebar(false);
  };

  const send = async () => {
    if (!msg.trim() || !activeId) return;

    setTyping(true);
    try {
      const res = await sendMessage({
        message: msg,
        conversationId: activeId,
      });

      setConversations((prev) => ({
        ...prev,
        [activeId]: [...prev[activeId], res.data],
      }));

      setMsg("");
    } finally {
      setTyping(false);
    }
  };

  const deleteAllHistory = async () => {
    if (!window.confirm("Delete all chats?")) return;
    await api.delete("/chat/history");
    setConversations({});
    setActiveId(null);
  };

  const deleteSingleChat = async (id) => {
    if (!window.confirm("Delete this chat?")) return;
    const updated = { ...conversations };
    delete updated[id];
    setConversations(updated);
    if (id === activeId) setActiveId(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-base-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full w-64 bg-base-200 flex flex-col transform transition-transform
        ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-3">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-2 bg-primary text-primary-content px-3 py-2 rounded-lg"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.keys(conversations).map((id) => (
            <div
              key={id}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-base-300
              ${id === activeId ? "bg-base-300" : ""}`}
              onClick={() => {
                setActiveId(id);
                setShowSidebar(false);
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={16} />
                <span className="truncate text-sm">
                  {conversations[id]?.[0]?.response || "New Chat"}
                </span>
              </div>

              <Trash2
                size={16}
                className="text-error hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSingleChat(id);
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="p-3 space-y-2 mt-auto">
          <button
            onClick={deleteAllHistory}
            className="w-full flex items-center gap-2 border px-3 py-2 rounded-lg text-error"
          >
            <Trash2 size={18} /> Delete History
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-base-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative">
        <header className="bg-primary text-primary-content px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={chatbotIcon}
              alt="Chatbot"
              className="w-7 h-7 object-contain"
            />
            <h2 className="font-semibold">Chatbot</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeButton />
            <button
              className="md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {!activeId && (
            <p className="text-center opacity-60 mt-10">
              Start a new chat
            </p>
          )}

          {activeId &&
            conversations[activeId]?.map((c) => (
              <div key={c._id} className="space-y-1">
                {c.message && (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-content px-4 py-2 rounded-2xl max-w-[75%] text-sm">
                      {c.message}
                    </div>
                  </div>
                )}

                {c.response && (
                  <div className="flex justify-start">
                    <div className="bg-base-300 px-4 py-2 rounded-2xl max-w-[75%] text-sm">
                      {c.response}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {typing && (
            <div className="text-sm opacity-60">Bot is typing…</div>
          )}
          <div ref={bottomRef} />
        </div>

        {activeId && (
          <div className="p-3 bg-base-200 flex items-center gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-base-100 outline-none"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="h-10 w-10 flex items-center justify-center bg-primary text-primary-content rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
