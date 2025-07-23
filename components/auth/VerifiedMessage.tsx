"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function VerifiedMessage() {
  const router = useRouter();

  const handleBackClick = () => {
    console.log("Back to home page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-purple-300 flex items-center justify-center p-4">
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 flex items-center text-white hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm">Home page</span>
      </button>

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-opacity-20 rounded-lg p-3">
          <div className="text-white font-bold text-3xl">FASTYR</div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-16">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            OTP Verified
          </h2>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-gray-500 text-sm">
            Your OTP has been successfully verified.
          </p>
          <button
            onClick={() => router.push("/chat")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Proceed to Chat
          </button>
          <p className="text-gray-600 text-sm">
            Return to{" "}
            <a
              href="/signin"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
