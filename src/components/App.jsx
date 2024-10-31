import './App.css';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Nav from './Nav';
import DonationForm from './DonationForm';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/form' element={ < DonationForm />} />
      </Routes>
    </>
    
  );
}

export default App;
