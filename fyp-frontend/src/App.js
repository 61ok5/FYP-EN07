import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AboutUs, Bridge, Footer, Gallery, Header } from './container';
import { Navbar } from './components';
import './App.css';
// import Home from './Home.jsx';

const App = () => (
  // <div>
  //   <Navbar />
  //   <Header />
  //   <AboutUs />
  //   <SpecialMenu />
  //   <Chef />
  //   <Intro />
  //   <Laurels />
  //   <Gallery />
  //   <FindUs />
  //   <Footer />
  // </div>
  <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Header /><Bridge /><Gallery /><AboutUs /><Footer /></>} />
        <Route path="/hi" element={<></>} />
      </Routes>
    </Router>
  </>

);

export default App;
