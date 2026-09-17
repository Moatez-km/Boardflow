const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type ApiOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

export async function api<T>(
    endpoint: string,
    options: ApiOptions = {},
): Promise<T> {
    const { body, headers, ...rest } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...rest,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
        ? await response.json()
        : null;

    if (!response.ok) {
        const message =
            data?.message || data?.error || 'Something went wrong';

        throw new Error(
            Array.isArray(message) ? message.join(', ') : message,
        );
    }

    return data as T;
}
