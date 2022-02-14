import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AboutUs, Chef, FindUs, Footer, Gallery, Header, Intro, Laurels, SpecialMenu } from './container';
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
        <Route path="/" element={<><Header /><AboutUs /><SpecialMenu /><Chef /><Intro /><Laurels /><Gallery /><FindUs /><Footer /></>} />
        {/* <Route path="/hi" element={<><Header /></>} /> */}
      </Routes>
    </Router>
  </>

);

export default App;
