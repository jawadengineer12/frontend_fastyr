"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function Header() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <header className="bg-[#101010] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Fastyr</h1>
      </div>
    </header>
  );
}
