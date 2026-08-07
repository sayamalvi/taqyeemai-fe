import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';

interface User {
    id: string;
    email: string;
    name: string;
    credits: number;
    tier: string;
    createdAt: string;
}

export function useUser() {
    return useQuery<User>({
        queryKey: ['user', 'me'],
        queryFn: async () => {
            const { data } = await api.get('/auth/me');
            return data;
        },
    });
}
