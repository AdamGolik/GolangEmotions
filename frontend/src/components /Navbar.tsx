"use client"
// components/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation'; // Zmiana importu

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <nav className="bg-indigo-600">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/main" className="text-white font-bold">
                            MoodTracker
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link href="/emotions" className="text-white hover:text-gray-200">
                                Emocje
                            </Link>
                            <Link href="/images" className="text-white hover:text-gray-200">
                                Moje Zdjęcia
                            </Link>
                            <Link href="/gallery" className="text-white hover:text-gray-200">
                                Galeria Publiczna
                            </Link>
                            <Link href="/analysis" className="text-white hover:text-gray-200">
                                Analiza
                            </Link>
                            <Link href="/account" className="text-white hover:text-gray-200">
                                Konto
                            </Link>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200"
                    >
                        Wyloguj
                    </button>
                </div>
            </div>
        </nav>
    );
}
