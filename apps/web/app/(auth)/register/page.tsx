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
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow"
            >
                <div>
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Start using BoardFlow
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    required
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />

                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />

                <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
                >
                    {isLoading ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </main>
    );
}
