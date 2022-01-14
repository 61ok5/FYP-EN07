import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import { CssBaseline } from "@mui/material";
import { height } from "@mui/system";

function App() {
  return (
    <div id="App" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Router>
        <Header />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />}/>
            <Route path="/resume" element={<Resume />}/> */}
          </Routes>
        </div>
        {/* <Footer /> */}
      </Router>

    </div>
  );
}
export default App;