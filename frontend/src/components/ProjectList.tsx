import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { ProjectCard } from './ProjectCard';

// Define the type for a project
export interface Project {
    id: string;
    title: string;
    description?: string;
    status: 'active' | 'completed' | 'archived';
    tasks: any[]; 
}

export const ProjectList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['projects', 'active'],
        queryFn: () => apiClient.get<{ data: Project[] }>('/projects?status=active').then(res => res.data.data)
    });

    if (isLoading) return <div>Loading projects...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <div>
            <h2>Active Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data?.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
                 {data?.length === 0 && <p>No active projects. Create one!</p>}
            </div>
        </div>
    );
};