// pages/register.tsx
"use client"; // Add this directive at the top of the file

import {useState} from 'react';
import {useRouter} from 'next/navigation'; // Zmiana importu
import api from '../../api/axios';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        user_name: '',
        password: '',
        PasswordConfirm: '',
        public: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            await router.push('/login');
        } catch (error) {
            console.error('Błąd rejestracji:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 text-black">
                <h2 className="text-2xl font-bold mb-6">Rejestracja</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nazwa użytkownika</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.user_name}
                            onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hasło</label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Potwierdź hasło</label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={formData.PasswordConfirm}
                            onChange={(e) => setFormData({...formData, PasswordConfirm: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Publiczny profil</label>
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={formData.public}
                            onChange={(e) => setFormData({...formData, public: e.target.checked})}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
                        >
                            Zarejestruj się
                        </button>
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-600">
                        Masz już konto?{' '}
                        <button
                            type="button"
                            className="text-blue-500 hover:underline"
                            onClick={() => router.push('/')}
                        >
                            Zaloguj się
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
