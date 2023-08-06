import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { AuthProvider } from './screens/Components/Auth';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <AuthProvider>
      <Router/>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
