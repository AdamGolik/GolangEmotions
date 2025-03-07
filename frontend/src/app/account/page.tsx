"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaUserEdit } from 'react-icons/fa';
import api from '../../api/axios';
import {AccountForm, FormActions, UserDataDisplay} from "@/components /account/UserDataDisplay";

interface UserData {
    email: string;
    user_name: string;
    public: boolean;
}

interface FormData extends UserData {
    password: string;
    PasswordConfirm: string;
    showPassword: boolean;
}

export default function Account() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>();
    const password = watch("password");

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get<UserData>('/account/See');
            setUserData(data);
            reset({
                email: data.email,
                user_name: data.user_name,
                public: data.public,
                password: '',
                PasswordConfirm: ''
            });
        } catch (error) {
            toast.error('Nie udało się pobrać danych konta');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (formData: FormData) => {
        try {
            setIsLoading(true);
            await api.put('/account/update', formData);
            toast.success('Dane zostały zaktualizowane');
            setIsEditing(false);
            await fetchUserData();
        } catch (error) {
            toast.error('Nie udało się zaktualizować danych');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <FaUserEdit className="text-blue-500" />
                Moje Konto
            </h1>

            {userData && !isEditing ? (
                <div className="bg-white p-6 rounded-lg shadow-lg transition-all">
                    <UserDataDisplay userData={userData} onEdit={() => setIsEditing(true)} />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                    <AccountForm
                        register={register}
                        errors={errors}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        password={password}
                    />
                    <FormActions onCancel={() => setIsEditing(false)} isLoading={isLoading} />
                </form>
            )}
        </div>
    );
}

// Komponenty pomocnicze...
// (Można je wydzielić do osobnych plików)
