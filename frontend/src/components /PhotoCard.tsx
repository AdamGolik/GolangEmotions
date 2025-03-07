"use client"
// components/PhotoCard.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface Photo {
    id: number;
    img: string;
    public: boolean;
}

export const PhotoCard = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        // Sprawdzamy localStorage tylko po stronie klienta
        const storedToken = window.localStorage.getItem('token');
        setToken(storedToken || '');
    }, []);

    useEffect(() => {
        if (!token) return; // Nie wykonuj zapytania jeśli nie ma tokenu

        const fetchPhotos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/img/my', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPhotos(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania zdjęć:', error);
            }
        };

        fetchPhotos();
    }, [token]);

    return (
        <div className="bg-white rounded-lg text-black shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Ostatnie Zdjęcia</h3>
            <div className="grid grid-cols-2 gap-2">
                {photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square">
                        {token && (
                            <Image
                                src={`http://localhost:8080/uploads/pictures/${photo.img}?token=${token}`}
                                alt="Zdjęcie użytkownika"
                                fill
                                className="rounded-md object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
