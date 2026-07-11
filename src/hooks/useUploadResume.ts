import { useMutation } from '@tanstack/react-query';
import { api } from '../../api';

interface UploadResumeParams {
    file: File;
    title: string;
    targetRole?: string;
    targetJobDescription?: string;
}

export function useUploadResume() {
    return useMutation({
        mutationFn: async ({ file, title, targetRole, targetJobDescription }: UploadResumeParams) => {
            // 1. Get or generate a persistent mock userId from localStorage
            let userId = localStorage.getItem('mock_user_id');
            if (!userId) {
                userId = crypto.randomUUID(); // Browser-native UUID generator
                localStorage.setItem('mock_user_id', userId);
            }

            const formData = new FormData();
            formData.append('resume', file);
            formData.append('title', title);
            formData.append('userId', userId); // Send the localStorage userId

            if (targetRole) formData.append('targetRole', targetRole);
            if (targetJobDescription) formData.append('targetJobDescription', targetJobDescription);

            const response = await api.post('/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
    });
}
