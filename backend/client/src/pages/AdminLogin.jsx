import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(password);
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm dark:shadow-none">
                <h1 className="text-2xl font-black tracking-tighter mb-6 text-center text-neutral-900 dark:text-white">
                    ADMIN ACCESS
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-1">PASSWORD</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-neutral-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm font-mono text-center">{error}</p>
                    )}

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        ENTER SYSTEM
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
