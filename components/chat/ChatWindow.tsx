"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  addMessage,
  sendChatMessage,
  uploadChatFile,
  clearUserChatHistory,
} from "@/redux/features/chatSlice";
import { RootState } from "@/redux/store";
import { ChatMessage } from "@/types/chat";
import { Send, User, Mail, Upload, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";
import { signOut } from "@/redux/features/authSlice";

export default function ChatWindow() {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [files, setFiles] = useState<File[] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { messages, status, error } = useSelector(
    (state: RootState) => state.chat
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInfo = {
    name: user ? user.firstName || user.email.split("@")[0] : "Guest",
  };

  const getInitials = (name: string) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const suggestions = [
    {
      icon: <User className="w-5 h-5 text-gray-600" />,
      title: "Write a to-do list for a personal project or task",
    },
    {
      icon: <Mail className="w-5 h-5 text-gray-600" />,
      title: "Generate an email to job offer",
    },
    {
      icon: <Upload className="w-5 h-5 text-gray-600" />,
      title: "Upload a document to analyze its content",
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to send messages.");
      return;
    }
    if (message.trim() || files) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: user.email,
        content: message.trim() || "Uploaded files",
        timestamp: new Date().toISOString(),
        files: files?.map((file) => ({ name: file.name, type: file.type })),
      };
      dispatch(addMessage(newMessage));
      try {
        if (message.trim()) {
          await dispatch(
            sendChatMessage({ email: user.email, prompt: message.trim() })
          ).unwrap();
        }
        if (files) {
          for (const file of files) {
            await dispatch(
              uploadChatFile({ email: user.email, file })
            ).unwrap();
            toast.success(`File "${file.name}" uploaded successfully!`);
          }
        }
        setShowSuggestions(false);
      } catch (error) {
        // Error is handled by Redux and displayed below
      }
      setMessage("");
      setFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to upload files.");
      return;
    }
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    } else {
      toast.error("Please select at least one file.");
    }
  };

  const handleClearHistory = async () => {
    if (!user) {
      toast.error("Please sign in to clear chat history.");
      return;
    }
    try {
      await dispatch(clearUserChatHistory(user.email)).unwrap();
      toast.success("Chat history cleared!");
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleSuggestionClick = (suggestion: { title: string }) => {
    setMessage(suggestion.title);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    dispatch(signOut());
    router.push("/signin");
    setShowDropdown(false);
    toast.success("Logged out successfully!");
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-50 relative "
      style={{
        backgroundImage: "url('/images/chat-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {status === "loading" && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-w border-b border-gray-300 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-semibold text-gray-800">FASTYR</span>
        </div>
        <div className="relative flex items-center space-x-2">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            disabled={!user}
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-medium">
              {getInitials(userInfo.name)}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {userInfo.name}
            </span>
          </button>
          {showDropdown && user && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center cursor-pointer"
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        {showSuggestions && messages.length === 0 ? (
          <div className="text-center space-y-8 w-full">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Hi {userInfo.name}
              </h1>
              <h2 className="text-4xl font-bold text-gray-800">
                What would you like to know?
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Use one of the most common prompts below
                <br />
                or use your own to begin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex flex-col space-y-3">
                    <div className="w-fit p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                      {suggestion.icon}
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {suggestion.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-4xl">
            <div className="space-y-6 mb-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === user?.email ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.sender === user?.email
                        ? "bg-white text-black border border-gray-200"
                        : "bg-white border border-gray-200"
                    } rounded-2xl px-4 py-3`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Attached files:</p>
                        {msg.files.map((file, index) => (
                          <p
                            key={index}
                            className="text-xs text-blue-600 underline"
                          >
                            {file.name}
                          </p>
                        ))}
                      </div>
                    )}
                    <p
                      className={`text-xs text-right mt-2 ${
                        msg.sender === user?.email
                          ? "text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto p-6 shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleClearHistory}
            disabled={status === "loading" || !user}
            className={`flex items-center p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors ${
              status === "loading" || !user
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <Trash2 className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700 ml-2">Clear History</span>
          </button>
          {files && files.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Selected files:</span>
              <span className="text-blue-600">
                {files.map((file) => file.name).join(", ")}
              </span>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSend}
          className="bg-white rounded-full border border-gray-200 shadow-sm p-2 flex items-center space-x-3"
        >
          <div className="p-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(e)}
            className="flex-1 py-2 px-2 bg-transparent border-none outline-none placeholder:text-gray-400 text-gray-800"
            placeholder="Ask whatever you want"
            disabled={!user}
          />
          <button
            type="submit"
            disabled={!user || (!message.trim() && !files)}
            className={`p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ${
              !user || (!message.trim() && !files)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        {!user && (
          <p className="text-center text-gray-600 text-sm mt-4">
            Please{" "}
            <a
              href="/signin"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              sign in
            </a>{" "}
            to send messages or upload files.
          </p>
        )}
      </div>
    </div>
  );
}
