"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { resetUserPassword } from "@/redux/features/authSlice";
import { ResetPasswordFormData } from "../../types/auth";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
    // email: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { status, error, resetEmail } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      dispatch({ type: 'auth/resetPassword/rejected', payload: 'No email found for reset' });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch({ type: 'auth/resetPassword/rejected', payload: 'Passwords do not match' });
      return;
    }
    try {
      await dispatch(resetUserPassword({
        email: resetEmail,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      })).unwrap();
      toast.success("Password reset successfully!");
      router.push("/signin");
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

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  const handleBackClick = () => {
    router.push("/otp");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-purple-300 flex items-center justify-center p-4">
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm">Back to OTP</span>
      </button>

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-opacity-20 rounded-lg p-3">
          <div className="text-white font-bold text-3xl">FASTYR</div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
          <p className="text-gray-500 text-sm">Please enter your new password!</p>
        </div>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        {status === "loading" && <Loader />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2 text-sm">
              New Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-sm bg-gray-50 pr-12"
                placeholder="Enter New Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {isPasswordVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2 text-sm">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-sm bg-gray-50 pr-12"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {isConfirmPasswordVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Reset Password
          </button>

          <p className="text-center text-gray-600 text-sm">
            Remember your password?{" "}
            <a href="/signin" className="text-blue-600 font-medium hover:text-blue-700">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}