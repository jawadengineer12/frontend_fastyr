"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "@/redux/features/authSlice";
import { SignInFormData } from "@/types/auth";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { RootState } from "@/redux/store";
import Loader from "../ui/Loader";

export default function SignInForm() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.auth);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();
      if (rememberMe) {
        localStorage.setItem(
          "access_token",
          (
            await dispatch(
              login({
                email: formData.email,
                password: formData.password,
              })
            ).unwrap()
          ).access_token
        );
      }
      router.push("/chat");
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-purple-300 flex items-center justify-center p-4">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-opacity-20 rounded-lg p-3">
          <div className="text-white font-bold text-3xl">FASTYR</div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-sm">
            Please enter your details.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}
        {status === "loading" && (
          <Loader />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2 text-sm"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-sm bg-gray-50"
              placeholder="Enter your Email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2 text-sm"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-sm bg-gray-50 pr-12"
                placeholder="Enter Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {isPasswordVisible ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              Remember me
            </label>
            <a
              href="/forget-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Sign in
          </button>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
