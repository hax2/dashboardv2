import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Project } from './Dashboard';

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const queryClient = useQueryClient();

    const archiveMutation = useMutation({
        mutationFn: () => apiClient.patch(`/projects/${project.id}/status`, { status: 'archived' }),
        onSuccess: () => {
            // When mutation is successful, refetch active and archived projects
            queryClient.invalidateQueries({ queryKey: ['projects', 'active'] });
            queryClient.invalidateQueries({ queryKey: ['projects', 'archived'] });
        },
    });

    return (
        <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>{project.tasks.length} subtasks</p>
            <button onClick={() => archiveMutation.mutate()}>
                Archive (Move to Trash)
            </button>
        </div>
    );
};