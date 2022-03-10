import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AboutUs, Bridge, Footer, Gallery, Header, Table } from './container';
import { Navbar, Course } from './components';
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
        <Route path="/course" element={<><Table /></>} />
        <Route path="/course/:id" element={<><Course /></>} />
      </Routes>
    </Router>
  </>

);

export default App;
