import './App.css';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes } from 'react-router-dom';
import Home from './Home';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
    
  );
}

export default App;
