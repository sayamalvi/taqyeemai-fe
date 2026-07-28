import { useMutation } from '@tanstack/react-query';
import { api } from '../../api';

interface UploadResumeParams {
    file: File;
    title: string;
}

export function useUploadResume() {
    return useMutation({
        mutationFn: async ({ file, title }: UploadResumeParams) => {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('title', title);

            const response = await api.post('/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
    });
}
