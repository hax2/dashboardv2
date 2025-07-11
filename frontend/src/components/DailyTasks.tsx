import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

interface DailyTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export const DailyTasks = () => {
    const queryClient = useQueryClient();
    const today = new Date().toISOString().split('T')[0]; // Get 'YYYY-MM-DD' format

    // Query to fetch the state of daily tasks for today
    const { data: tasks, isLoading } = useQuery<DailyTask[]>({
        queryKey: ['dailyTasks', today],
        queryFn: () => apiClient.get(`/daily-tasks?date=${today}`).then(res => res.data.data),
    });

    // Mutation to log a task's completion status
    const logTaskMutation = useMutation({
        mutationFn: (variables: { taskId: string; isCompleted: boolean }) => 
            apiClient.post('/daily-tasks/log', { ...variables, date: today }),
        onSuccess: () => {
            // When a task is logged, invalidate the query to refetch and update the UI
            queryClient.invalidateQueries({ queryKey: ['dailyTasks', today] });
        }
    });

    const handleCheckboxChange = (taskId: string, currentStatus: boolean) => {
        logTaskMutation.mutate({ taskId, isCompleted: !currentStatus });
    };

    // --- For creating new task templates ---
    const [newTemplateTitle, setNewTemplateTitle] = useState('');
    const createTemplateMutation = useMutation({
        mutationFn: (title: string) => apiClient.post('/daily-tasks/template', { title }),
        onSuccess: () => {
            setNewTemplateTitle('');
            queryClient.invalidateQueries({ queryKey: ['dailyTasks', today] });
        }
    });

    const handleCreateTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if(newTemplateTitle.trim()){
            createTemplateMutation.mutate(newTemplateTitle.trim());
        }
    }

    return (
        <div>
            <h2>Daily Tasks ({today})</h2>
            {isLoading && <p>Loading...</p>}
            <div>
                {tasks?.map(task => (
                    <div key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => handleCheckboxChange(task.id, task.isCompleted)}
                                disabled={logTaskMutation.isLoading}
                            />
                            {task.title}
                        </label>
                    </div>
                ))}
            </div>

            <hr style={{margin: '1rem 0'}}/>

            <form onSubmit={handleCreateTemplate}>
                <input 
                    type="text"
                    value={newTemplateTitle}
                    onChange={(e) => setNewTemplateTitle(e.target.value)}
                    placeholder="Add new daily task"
                />
                <button type="submit" disabled={createTemplateMutation.isLoading}>Add</button>
            </form>
        </div>
    );
};