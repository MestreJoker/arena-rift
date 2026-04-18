"use client";

export default function ProfileHeader() {
  const user = {
    name: "Gabriel",
    avatar: "https://i.pravatar.cc/150",
  };

  return (
    <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-2xl">
      <img
        src={user.avatar}
        alt="avatar"
        className="w-16 h-16 rounded-full border border-neutral-700"
      />

      <div>
        <h1 className="text-xl font-bold">{user.name}</h1>
        <p className="text-sm text-neutral-400">Conectado via Discord</p>
      </div>
    </div>
  );
}