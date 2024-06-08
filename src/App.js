import './App.css';
import { Routes, Route } from 'react-router-dom';

import Term1 from './components/Term1';
import Term2 from './components/Term2';
import Term3 from './components/Term3';
import Term4 from './components/Term4';
import Term5 from './components/Term5';
import Homepage from './components/Homepage';
import Calculator from './components/Calculator';
import Notfoundpage  from './components/Notfoundpage';
import Menu from './components/Menu';

function App() {
  return (
    <>
      <Menu/>
      <div className='Background'>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/term1" element={<Term1 />} />
        <Route path="/term2" element={<Term2 />} />
        <Route path="/term3" element={<Term3 />} />
        <Route path="/term4" element={<Term4 />} />
        <Route path="/term5" element={<Term5 />} />
        <Route path="/calc" element={<Calculator />} />
        <Route path="*" element={<Notfoundpage />} />
      </Routes>
      </div>
    </>
  );
}

export default App;
