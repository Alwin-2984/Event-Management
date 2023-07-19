import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/User/Dashboard';
import NotFound from './screens/Components/NotFound404'; // Import your custom 404 component

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Add more routes as needed */}
          <Route path="*" element={<NotFound />} /> {/* 404 page */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
