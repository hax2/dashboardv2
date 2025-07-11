import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Project } from './Dashboard';

export const Archive = () => {
    const queryClient = useQueryClient();

    const { data: archivedProjects, isLoading } = useQuery({
        queryKey: ['projects', 'archived'],
        queryFn: () => apiClient.get<{ data: Project[] }>('/projects?status=archived').then(res => res.data.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (projectId: string) => apiClient.delete(`/projects/${projectId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', 'archived'] });
        },
    });

    const handlePermanentDelete = (projectId: string, projectTitle: string) => {
        if (window.confirm(`Are you sure you want to permanently delete "${projectTitle}"? This cannot be undone.`)) {
            deleteMutation.mutate(projectId);
        }
    }

    if (isLoading) return <div>Loading archive...</div>

    return (
        <div>
            <h2>Archive (Trash)</h2>
            {archivedProjects?.map(project => (
                <div key={project.id} style={{ border: '1px solid #fdd', padding: '0.5rem', marginBottom: '0.5rem' }}>
                    <p>{project.title}</p>
                    <button style={{ color: 'red' }} onClick={() => handlePermanentDelete(project.id, project.title)}>
                        Delete Permanently
                    </button>
                    {/* Add a "Restore" button here */}
                </div>
            ))}
        </div>
    );
}