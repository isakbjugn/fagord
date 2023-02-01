import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/main/main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={fagordTheme}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
