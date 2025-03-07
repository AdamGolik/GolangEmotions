"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTrash, FaEdit, FaGlobe, FaLock } from 'react-icons/fa';
import api from '../../api/axios';

interface Photo {
    id: number;
    img: string;
    public: boolean;
}

export default function Images() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [token, setToken] = useState<string>('');
    const [editingPhoto, setEditingPhoto] = useState<number | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const storedToken = window.localStorage.getItem('token');
        setToken(storedToken || '');
    }, []);

    const fetchPhotos = async () => {
        if (!token) return;
        try {
            const response = await api.get('/img/my');
            setPhotos(response.data);
        } catch (error) {
            console.error('Błąd pobierania zdjęć:', error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, [token]);

    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !token) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('public', 'true');

        try {
            await api.post('/img/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchPhotos();
            setSelectedFile(null);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Błąd dodawania zdjęcia:', error);
        }
    };

    const deletePhoto = async (id: number) => {
        if (!window.confirm('Czy na pewno chcesz usunąć to zdjęcie?')) return;

        try {
            await api.delete(`/img/${id}`);
            await fetchPhotos();
        } catch (error) {
            console.error('Błąd usuwania zdjęcia:', error);
        }
    };

    const togglePublic = async (photo: Photo) => {
        try {
            const formData = new FormData();
            formData.append('public', (!photo.public).toString());

            await api.put(`/img/${photo.id}`, formData);
            await fetchPhotos();
        } catch (error) {
            console.error('Błąd aktualizacji statusu zdjęcia:', error);
        }
    };

    const updatePhoto = async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.put(`/img/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchPhotos();
            setEditingPhoto(null);
        } catch (error) {
            console.error('Błąd aktualizacji zdjęcia:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Moje Zdjęcia</h1>

            <form onSubmit={uploadImage} className="mb-8 bg-white rounded-lg p-6 shadow-lg">
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-gray-700"
                            accept="image/*"
                        />
                        {!selectedFile && (
                            <p className="mt-2 text-sm text-gray-600">Nie wybrano zdjęcia</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        disabled={!selectedFile}
                    >
                        Dodaj zdjęcie
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
                        <div className="relative aspect-square group">
                            {token && (
                                <>
                                    <Image
                                        src={`${API_URL}/uploads/pictures/${photo.img}?token=${token}`}
                                        alt={`Zdjęcie ${photo.id}`}
                                        fill
                                        className="rounded-lg object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => togglePublic(photo)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                                            title={photo.public ? "Ustaw jako prywatne" : "Ustaw jako publiczne"}
                                        >
                                            {photo.public ? <FaGlobe className="text-blue-500" /> : <FaLock className="text-gray-700" />}
                                        </button>
                                        <label className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                                            <FaEdit className="text-green-500" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) updatePhoto(photo.id, file);
                                                }}
                                            />
                                        </label>
                                        <button
                                            onClick={() => deletePhoto(photo.id)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <FaTrash className="text-red-500" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {photos.length === 0 && (
                <div className="text-center text-gray-300 mt-8">
                    <p className="text-xl">Nie masz jeszcze żadnych zdjęć</p>
                    <p className="mt-2">Dodaj swoje pierwsze zdjęcie używając formularza powyżej</p>
                </div>
            )}
        </div>
    );
}
