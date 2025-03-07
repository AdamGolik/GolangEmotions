"use client";
// pages/analysis.tsx
import {useState, useEffect} from 'react';
import api from '../../api/axios';
import {FaSmile, FaChartLine, FaLightbulb} from 'react-icons/fa';

export default function Analysis() {
    const [analysis, setAnalysis] = useState<any>(null);

    const fetchAnalysis = async () => {
        try {
            const response = await api.get('/emotions/analysis');
            setAnalysis(response.data.analysis);
        } catch (error) {
            console.error('Błąd pobierania analizy:', error);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6 text-black">Analiza Emocji</h1>

            {analysis && (
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-black">
                        <FaChartLine className="text-blue-500"/> Wyniki analizy
                    </h2>
                    <p className="text-lg text-black flex items-center gap-2 mb-2">
                        <FaSmile className="text-yellow-500"/> Przewidywany nastrój: {analysis.predicted_mood}
                    </p>
                    <p className="text-lg text-black flex items-center gap-2 mb-2">
                        <FaChartLine className="text-green-500"/> Pewność predykcji: {analysis.confidence}
                    </p>
                    <p className="text-lg text-black flex items-center gap-2">
                        <FaLightbulb className="text-orange-500"/> Rekomendacja: {analysis.recommendation}
                    </p>
                </div>
            )}
        </div>
    );
}
