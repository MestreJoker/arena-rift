"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    alert("Logout realizado"); // depois liga com contexto
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