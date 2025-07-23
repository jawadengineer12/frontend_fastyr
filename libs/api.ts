import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ErrorResponse {
  detail: string;
}

export const registerUser = async (userData: {
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.detail || "Registration failed");
  }
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await api.post("/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.detail || "Login failed");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.detail || "Failed to send reset email"
    );
  }
};

export const verifyPin = async (data: { email: string; pin_code: string }) => {
  try {
    const response = await api.post("/pin-verification", data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.detail || "Invalid OTP");
  }
};

export const resetPassword = async (data: {
  email: string;
  new_password: string;
  confirm_password: string;
}) => {
  try {
    const response = await api.post("/reset-password", data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.detail || "Failed to reset password"
    );
  }
};

export const uploadFile = async (email: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/chat/upload/${email}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.detail || 'File upload failed');
  }
};

export const createChat = async (email: string, prompt: string) => {
  try {
    const response = await api.get('/chat/create', {
      params: { email, prompt },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.detail || 'Chat creation failed');
  }
};

export const clearChatHistory = async (email: string) => {
  try {
    const response = await api.get(`/chat/clearHistory/${email}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.detail || 'Failed to clear chat history');
  }
};