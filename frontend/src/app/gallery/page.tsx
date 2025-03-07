// pages/gallery/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/api/axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface PublicPhoto {
    ID: number;
    Img: string;
    created_at: string;
}

export default function PublicGallery() {
    const [photos, setPhotos] = useState<PublicPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useState<string>('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const storedToken = window.localStorage.getItem('token');
        setToken(storedToken || '');
    }, []);

    const fetchPhotos = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/all');
            // Filtruj zdjęcia, które mają poprawne dane
            const validPhotos = response.data.filter((photo: any) =>
                photo && photo.Img && typeof photo.Img === 'string'
            );
            setPhotos(validPhotos);
        } catch (error) {
            console.error('Błąd pobierania zdjęć:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPhotos();
        }
    }, [token]);

    const filteredPhotos = photos.filter(photo =>
        photo?.Img?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!token) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-white">
                <h1 className="text-3xl font-bold mb-4">Galeria Publiczna</h1>
                <p>Zaloguj się, aby zobaczyć zdjęcia</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Galeria Publiczna</h1>

            <div className="mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Szukaj zdjęć..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            ) : filteredPhotos.length === 0 ? (
                <div className="text-center text-gray-300 mt-8">
                    <p className="text-xl">Brak zdjęć w galerii</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredPhotos.map((photo) => (
                        <div key={photo.ID} className="bg-white/5 rounded-lg shadow-lg p-4 hover:bg-white/10 transition-all duration-300">
                            <div className="relative aspect-square group">
                                <Image
                                    src={`${API_URL}/uploads/pictures/${photo.Img}?token=${token}`}
                                    alt={`Zdjęcie ${photo.ID}`}
                                    fill
                                    className="rounded-lg object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg" />
                            </div>
                            <div className="mt-2 text-sm text-gray-300">
                                Dodano: {new Date(photo.created_at).toLocaleDateString('pl-PL')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
