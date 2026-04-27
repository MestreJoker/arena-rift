"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-semibold"
    >
      Sair da conta
    </button>
  );
}