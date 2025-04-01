import React from 'react';
import Home from './components/Home';
import About from './components/About';
import Menu from './components/Menu';
import Info from './components/Info';
import Contact from './components/Contact';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/displayResults/:randomText" element={<Menu />} />
        <Route path="/propertyDetails/:randomText" element={<Info />} />
        <Route path="/contactAgentDetails/:randomText" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
