import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getBotData, createBotData, deleteBotData, updateBotData,} from "../api/admin.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useThemeStore } from "../store/useThemeStore.jsx";
import ThemeButton from "./ThemeButton.jsx";

import chatbotIcon from "../assets/chatbot.png";

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getBotData();
      setData(res.data);
    } catch {
      setError("Failed to load knowledge base");
    }
  };

  const handleSubmit = async () => {
    if (!form.question || !form.answer) {
      return setError("Both question and answer are required");
    }

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        const res = await updateBotData(editingId, form);
        setData((prev) =>
          prev.map((d) => (d._id === editingId ? res.data : d))
        );
        setEditingId(null);
      } else {
        const res = await createBotData(form);
        setData((prev) => [...prev, res.data]);
      }

      setForm({ question: "", answer: "" });
    } catch {
      setError("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({ question: item.question, answer: item.answer });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      await deleteBotData(id);
      setData((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={chatbotIcon}
              alt="Admin"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl sm:text-2xl font-bold">
              Admin Knowledge Base
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeButton />
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-base-300 hover:opacity-80 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="bg-base-200 shadow rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            {editingId ? "Edit Response" : "Add Bot Response"}
          </h2>

          {error && (
            <p className="text-error text-sm mb-3">{error}</p>
          )}

          <div className="grid grid-cols-1 gap-3">
            <input
              placeholder="Enter question"
              value={form.question}
              onChange={(e) =>
                setForm({ ...form, question: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-base-100 outline-none"
            />

            <textarea
              placeholder="Enter answer"
              value={form.answer}
              onChange={(e) =>
                setForm({ ...form, answer: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-base-100 outline-none"
              rows={3}
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-primary text-primary-content px-4 py-2 rounded-md disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Add"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm({ question: "", answer: "" });
                  }}
                  className="px-4 py-2 rounded-md bg-base-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-base-200 shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            Stored Questions & Answers
          </h2>

          {data.length === 0 ? (
            <p className="opacity-60 text-sm">No data available.</p>
          ) : (
            <div className="space-y-4">
              {data.map((d) => (
                <div
                  key={d._id}
                  className="flex flex-col sm:flex-row sm:justify-between gap-3 border-b border-base-300 pb-3"
                >
                  <div>
                    <p className="font-medium">
                      Q: {d.question}
                    </p>
                    <p className="text-sm opacity-70">
                      A: {d.answer}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(d)}
                      className="text-primary text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="text-error text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default AdminPanel;