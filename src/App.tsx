import './App.css';
import { BrowserRouter } from 'react-router-dom'
import Main from './components/main/main'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Main/>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
