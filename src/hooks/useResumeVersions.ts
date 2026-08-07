import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';

export const resumeKeys = {
    all: ['resumes'],
    detail: (id: string) => [...resumeKeys.all, 'detail', id],
    versionAnalysis: (id: string, versionId: string) => [...resumeKeys.all, 'analysis', id, versionId],
};

export function useResume(id: string) {
    return useQuery({
        queryKey: resumeKeys.detail(id),
        queryFn: async () => {
            const response = await api.get(`/resume/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useAnalysisForVersion(id: string, versionId: string) {
    return useQuery({
        queryKey: resumeKeys.versionAnalysis(id, versionId),
        queryFn: async () => {
            const response = await api.get(`/resume/${id}/versions/${versionId}/analysis`);
            return response.data;
        },
        enabled: !!id && !!versionId,
    });
}

// ADD THIS NEW HOOK:
export function useAnalyzeResume(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: { versionId: string, targetRole?: string, targetJobDescription?: string }) => {
            const response = await api.post(`/resume/${id}/analyze`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Refetch the detail and analysis data to update the UI instantly
            qc.invalidateQueries({ queryKey: resumeKeys.detail(id) });
            qc.invalidateQueries({ queryKey: resumeKeys.versionAnalysis(id, variables.versionId) });
            qc.invalidateQueries({ queryKey: ['user', 'me'] });
        }
    });
}

export function useAllResumes() {
    return useQuery({
        queryKey: resumeKeys.all,
        queryFn: async () => {
            const response = await api.get('/resume');
            return response.data;
        }
    });
}

export function useApplyRewrites(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: { baseVersionId: string, rewrites: { original: string, rewritten: string }[] }) => {
            const response = await api.post(`/resume/${id}/rewrites`, data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate to fetch the newly created version instantly
            qc.invalidateQueries({ queryKey: resumeKeys.detail(id) });
        }
    });
}


export function useDownloadPdf(id: string) {
    return useMutation({
        mutationFn: async (versionId: string) => {
            const response = await api.post(`/resume/${id}/versions/${versionId}/download`, undefined, {
                responseType: 'blob'
            });
            return response.data as Blob;
        },
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Optimized_Resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    });
}

