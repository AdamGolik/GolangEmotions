"use client";
import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { FaSmile, FaDumbbell, FaClock, FaMoon, FaEdit, FaTrash } from 'react-icons/fa';

interface Emotion {
    id: number;
    feel: string;
    workout: string;
    workout_time: string;
    moon: string;
}

export default function Emotions() {
    const [emotions, setEmotions] = useState<Emotion[]>([]);
    const [newEmotion, setNewEmotion] = useState({
        feel: '',
        workout: '',
        workout_time: '',
        moon: ''
    });

    const getWorkoutColor = (intensity: string) => {
        switch (intensity) {
            case 'none': return 'text-gray-500';
            case 'low': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'high': return 'text-orange-500';
            case 'very high': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case 'happy': return 'text-yellow-500';
            case 'sad': return 'text-blue-500';
            case 'neutral': return 'text-gray-500';
            case 'excited': return 'text-green-500';
            case 'angry': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const fetchEmotions = async () => {
        try {
            const response = await api.get('/emotions/my');
            setEmotions(response.data);
        } catch (error) {
            console.error('Błąd pobierania emocji:', error);
        }
    };

    const addEmotion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/emotions/add', newEmotion);
            await fetchEmotions();
            setNewEmotion({ feel: '', workout: '', workout_time: '', moon: '' });
        } catch (error) {
            console.error('Błąd dodawania emocji:', error);
        }
    };

    const deleteEmotion = async (id: number) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten wpis?')) {
            try {
                await api.delete(`/emotions/delete/${id}`);
                await fetchEmotions();
            } catch (error) {
                console.error('Błąd usuwania emocji:', error);
            }
        }
    };

    useEffect(() => {
        fetchEmotions();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Dziennik Emocji</h1>

            {/* Formularz dodawania */}
            <form onSubmit={addEmotion} className="mb-8 flex gap-4 bg-white p-6 rounded-xl shadow-sm">
                <input
                    type="number"
                    placeholder="Samopoczucie (1-10)"
                    value={newEmotion.feel}
                    onChange={(e) => setNewEmotion({...newEmotion, feel: e.target.value})}
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder-gray-500"
                    min="1"
                    max="10"
                />
                <select
                    value={newEmotion.workout}
                    onChange={(e) => setNewEmotion({...newEmotion, workout: e.target.value})}
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
                >
                    <option value="">Poziom treningu</option>
                    <option value="none">Brak treningu</option>
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                    <option value="very high">Bardzo wysoki</option>
                </select>
                <input
                    type="number"
                    placeholder="Czas treningu (h)"
                    value={newEmotion.workout_time}
                    onChange={(e) => setNewEmotion({...newEmotion, workout_time: e.target.value})}
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder-gray-500"
                />
                <select
                    value={newEmotion.moon}
                    onChange={(e) => setNewEmotion({...newEmotion, moon: e.target.value})}
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
                >
                    <option value="">Wybierz nastrój</option>
                    <option value="happy">Szczęśliwy</option>
                    <option value="sad">Smutny</option>
                    <option value="neutral">Neutralny</option>
                    <option value="excited">Podekscytowany</option>
                    <option value="angry">Zły</option>
                </select>
                <button
                    type="submit"
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Dodaj
                </button>
            </form>

            {/* Lista emocji */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emotions.map((emotion) => (
                    <div key={emotion.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <FaSmile className={`text-xl ${getMoodColor(emotion.moon)}`} />
                                <span className="text-blue-500 font-medium text-lg">{emotion.feel}/10</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {/* logika edycji */}}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    <FaEdit className="text-lg" />
                                </button>
                                <button
                                    onClick={() => deleteEmotion(emotion.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <FaTrash className="text-lg" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaDumbbell className={`text-lg ${getWorkoutColor(emotion.workout)}`} />
                                <span className={getWorkoutColor(emotion.workout)}>
                                    {emotion.workout.charAt(0).toUpperCase() + emotion.workout.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaClock className="text-green-500 text-lg" />
                                <span className="text-green-500">{emotion.workout_time}h</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaMoon className={`text-lg ${getMoodColor(emotion.moon)}`} />
                                <span className={getMoodColor(emotion.moon)}>{emotion.moon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
