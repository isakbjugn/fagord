import './App.css';
import { BrowserRouter } from 'react-router-dom'
import Main from './components/main-component'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Main/>
      </div>
    </BrowserRouter>
  );
}

export default App;
