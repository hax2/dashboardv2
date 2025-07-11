import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Dashboard } from './components/Dashboard';

const queryClient = new QueryClient();

function App() {
  // A real app would have a router here with login/signup pages
  // For now, we'll assume the user is logged in.
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Supersmart Life App</h1>
        <Dashboard />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;