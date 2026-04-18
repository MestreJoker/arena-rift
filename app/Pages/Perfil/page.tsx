"use client";

import LogoutButton from "@/app/Components/ComponentesPerfilPage/LogoutButton/page";
import ProfileHeader from "@/app/Components/ComponentesPerfilPage/ProfileHeader/page";
import ProfileStats from "@/app/Components/ComponentesPerfilPage/ProfileStats/page";
import ProfileTournaments from "@/app/Components/ComponentesPerfilPage/ProfileTournaments/page";
import Header from "@/app/Components/Header/page";


export default function PerfilPage() {
    return (
        <>
            <div className="mb-17">
                <Header />
            </div>
            <main className="min-h-screen bg-black text-white p-6">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                    <ProfileHeader />
                    <ProfileStats />
                    <ProfileTournaments />
                    <LogoutButton />
                </div>
            </main>
        </>

    );
}