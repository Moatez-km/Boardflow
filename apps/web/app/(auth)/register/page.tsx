'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/src/lib/auth-api';

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            await register({
                name,
                email,
                password,
            });

            router.push('/login');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Registration failed',
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-xl bg-gray-900 p-8 shadow-xl shadow-black/20"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Create an account
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Start using BoardFlow
                    </p>
                </div>

                {error && (
                    <div className="rounded-md border border-red-900 bg-red-950/50 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    required
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />

                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />

                <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </main>
    );
}
