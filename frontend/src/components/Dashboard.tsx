import { ProjectList } from './ProjectList';
import { Archive } from './Archive';
import { DailyTasks } from './DailyTasks';

export const Dashboard = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
            {/* Sidebar */}
            <div style={{ borderRight: '1px solid #ccc', paddingRight: '2rem' }}>
                <DailyTasks />
                <hr style={{margin: '2rem 0'}} />
                <Archive />
            </div>

            {/* Main Window */}
            <div>
                <ProjectList />
            </div>
        </div>
    );
};