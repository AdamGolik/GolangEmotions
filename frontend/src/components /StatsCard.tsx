// components/StatsCard.tsx
import React from 'react';

export const StatsCard = () => {
    return (
        <div className="bg-white text-black rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Statystyki Tygodniowe</h3>
            <div className="space-y-4">
                <div className={"text-black"}>
                    <p className="text-sm  text-black ">Średni nastrój</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-black">Aktywność fizyczna</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-black">Jakość snu</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
