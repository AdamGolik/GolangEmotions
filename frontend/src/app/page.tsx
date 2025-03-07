"use client";

import {useState} from 'react';
import {useRouter} from 'next/navigation'; // Zmiana importu
import {FaEye, FaEyeSlash} from 'react-icons/fa'; // Ikony do haseł
import api from '../api/axios';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        PasswordConfirm: '' // Zachowujemy tę samą nazwę jak w backend
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', formData);
            localStorage.setItem('token', response.data.token);
            router.push('/main'); // Przesunięcie na stronę główną po zalogowaniu
        } catch (error) {
            console.error('Błąd logowania:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Logowanie</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full  text-black rounded-md border-gray-300 shadow-sm"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Hasło
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Potwierdź hasło
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm"
                                value={formData.PasswordConfirm}
                                onChange={(e) => setFormData({...formData, PasswordConfirm: e.target.value})}
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Zaloguj się
                    </button>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Nie masz konta? </span>
                        <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            Zarejestruj się
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
}
