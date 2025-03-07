// components/EmotionCard.tsx
import React from 'react';

export const EmotionCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl text-black font-semibold mb-4">Dzisiejsze Emocje</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-black  items-center">
                    <span>Nastrój:</span>
                    <span className="font-medium">Pozytywny 😊</span>
                </div>
                <div className="flex text-black justify-between items-center">
                    <span>Poziom energii:</span>
                    <span className="font-medium">8/10</span>
                </div>
                <div className="flex text-black justify-between items-center">
                    <span>Aktywność:</span>
                    <span className="font-medium">Trening</span>
                </div>
            </div>
        </div>
    );
};
