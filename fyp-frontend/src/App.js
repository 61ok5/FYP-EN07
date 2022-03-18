/* eslint arrow-body-style: 1 */
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AboutUs, Bridge, Footer, Gallery, Header, Table } from './container';
import { Navbar, Course, Login } from './components';
import { theme } from './components/Login/theme';
import { JWTProvider } from './components/Login/JWTContext';
import './App.css';
// import Home from './Home.jsx';

const App = () => {
  // const customization = useSelector((state) => state.customization);
  return (
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
      <ThemeProvider theme={theme()}>
        <JWTProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<><Header /><Bridge /><Gallery /><AboutUs /><Footer /></>} />
              <Route path="/course" element={<><Table /></>} />
              <Route path="/course/:id" element={<><Course /></>} />
              <Route path="/login" element={<><Login /></>} />
            </Routes>
          </Router>
        </JWTProvider>
      </ThemeProvider>
    </>

  );
};

export default App;
