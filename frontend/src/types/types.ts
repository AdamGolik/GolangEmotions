// types/types.ts
export interface Emotion {
    id: number;
    user_id: number;
    feel: string;
    workout: string;
    workout_time: string;
    moon: string;
}

export interface User {
    id: number;
    email: string;
    user_name: string;
    public: boolean;
}

export interface Image {
    id: number;
    user_id: number;
    img: string;
    public: boolean;
}
