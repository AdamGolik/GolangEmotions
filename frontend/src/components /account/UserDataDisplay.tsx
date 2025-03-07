// components/account/UserDataDisplay.tsx
interface UserDataDisplayProps {
    userData: {
        email: string;
        user_name: string;
        public: boolean;
    };
    onEdit: () => void;
}

export const UserDataDisplay = ({ userData, onEdit }: UserDataDisplayProps) => {
    return (
        <div className="space-y-4">
            <div className="grid gap-6">
                <DataField label="Email" value={userData.email} />
                <DataField label="Nazwa użytkownika" value={userData.user_name} />
                <DataField
                    label="Status profilu"
                    value={userData.public ? 'Publiczny' : 'Prywatny'}
                />
            </div>
            <button
                onClick={onEdit}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <span>Edytuj profil</span>
            </button>
        </div>
    );
};

const DataField = ({ label, value }: { label: string; value: string }) => (
    <div className="border-b border-gray-200 pb-3">
        <p className="text-gray-600 text-sm mb-1">{label}</p>
        <p className="text-black font-medium">{value}</p>
    </div>
);

// components/account/AccountForm.tsx
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface AccountFormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    password: string;
}

export const AccountForm = ({
                                register,
                                errors,
                                showPassword,
                                setShowPassword,
                                password
                            }: AccountFormProps) => {
    return (
        <div className="space-y-6">
            <FormField
                label="Email"
                type="email"
                {...register("email", {
                    required: "Email jest wymagany",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Nieprawidłowy format email"
                    }
                })}
                error={errors.email?.message as string}
            />

            <FormField
                label="Nazwa użytkownika"
                {...register("user_name", {
                    required: "Nazwa użytkownika jest wymagana",
                    minLength: {
                        value: 3,
                        message: "Nazwa użytkownika musi mieć min. 3 znaki"
                    }
                })}
                error={errors.user_name?.message as string}
            />

            <div className="relative">
                <FormField
                    label="Hasło"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                        minLength: {
                            value: 6,
                            message: "Hasło musi mieć min. 6 znaków"
                        }
                    })}
                    error={errors.password?.message as string}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500"
                >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>

            <FormField
                label="Potwierdź hasło"
                type="password"
                {...register("PasswordConfirm", {
                    validate: value =>
                        value === password || "Hasła nie są identyczne"
                })}
                error={errors.PasswordConfirm?.message as string}
            />

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    {...register("public")}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <label className="text-sm text-gray-700">Profil publiczny</label>
            </div>
        </div>
    );
};

const FormField = ({ label, error, ...props }: any) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all
                ${error ? 'border-red-500' : 'border-gray-300'}`}
            {...props}
        />
        {error && (
            <p className="text-red-500 text-sm">{error}</p>
        )}
    </div>
);

// components/account/FormActions.tsx
interface FormActionsProps {
    onCancel: () => void;
    isLoading: boolean;
}

export const FormActions = ({ onCancel, isLoading }: FormActionsProps) => {
    return (
        <div className="flex justify-end space-x-4 mt-8">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
            >
                Anuluj
            </button>
            <button
                type="submit"
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-all
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Zapisywanie...</span>
                    </div>
                ) : (
                    'Zapisz zmiany'
                )}
            </button>
        </div>
    );
};
