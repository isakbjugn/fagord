import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/main/main';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const queryClient = new QueryClient();

const fagordTheme = createTheme({
  palette: {
    primary: {
      main: '#29648a',
    },
    secondary: {
      main: '#2e9cca',
    },
    background: {
      paper: '#fbfcfd',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={fagordTheme}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Main />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
