"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-semibold hover:cursor-pointer hover:scale-103"
      >
        Sair da conta
      </button>
    </div>
  );
}