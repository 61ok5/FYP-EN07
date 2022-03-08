import React from 'react';
import { useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import images from '../../constants/images';
import './Navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const location = useLocation();

  return (
    <nav className="app__navbar" style={location.pathname !== '/' ? { borderBottom: '0.1rem solid #ebdcac' } : {}}>
      <div className="app__navbar-logo">
        <img src={images.gericht} alt="app__logo" />
      </div>
      <ul className="app__navbar-links">
        <li className={location.pathname === '/' ? 'p__opensans_white' : 'p__opensans'}><a href={location.pathname === '/' ? '#home' : '/#home'}>Home</a></li>
        <li className={location.pathname === '/' ? 'p__opensans_white' : 'p__opensans'}><a href={location.pathname === '/' ? '#about' : '/#about'}>About</a></li>
        <li className={location.pathname === '/' ? 'p__opensans_white' : 'p__opensans'}><a href={location.pathname === '/' ? '#topics' : '/#topics'}>Topics</a></li>
        <li className={location.pathname === '/' ? 'p__opensans_white' : 'p__opensans'}><a href="/hi">Courses</a></li>
        {/* <li className="p__opensans_white"><a href="#contact">Contact</a></li> */}
      </ul>
      <div className="app__navbar-login">
        <a href="#login" className={location.pathname === '/' ? 'p__opensans_white' : 'p__opensans'}>Log In / Registration</a>
        <div />
        <a href="/" className={location.pathname === '/' ? 'p__opensans_white' : 'p__opensans'}>Book Table</a>
      </div>
      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu color="#fff" fontSize={27} onClick={() => setToggleMenu(true)} />
        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdClose fontSize={27} className="overlay__close" onClick={() => setToggleMenu(false)} />
            <ul className="app__navbar-smallscreen_links">
              <li className="p__opensans_white" style={{ textShadow: '0px 0px 3px rgba(0, 0, 0, 0.8)' }}>
                <a href={location.pathname === '/' ? '#about' : '/#about'} onClick={() => setToggleMenu(false)}>
                  <img src={images.key} alt="key" style={{ width: '2rem', marginRight: '1rem' }} />
                  About
                </a>
              </li>
              <li className="p__opensans_white" style={{ textShadow: '0px 0px 3px rgba(0, 0, 0, 0.8)' }}>
                <a href={location.pathname === '/' ? '#home' : '/#home'} onClick={() => setToggleMenu(false)}>
                  <img src={images.key} alt="key" style={{ width: '2rem', marginRight: '1rem' }} />
                  Home
                </a>
              </li>
              <li className="p__opensans_white" style={{ textShadow: '0px 0px 3px rgba(0, 0, 0, 0.8)' }}>
                <a href={location.pathname === '/' ? '#topics' : '/#topics'} onClick={() => setToggleMenu(false)}>
                  <img src={images.key} alt="key" style={{ width: '2rem', marginRight: '1rem' }} />
                  Topics
                </a>
              </li>
              <li className="p__opensans_white" style={{ textShadow: '0px 0px 3px rgba(0, 0, 0, 0.8)' }}>
                <a href="/hi" onClick={() => setToggleMenu(false)}>
                  <img src={images.key} alt="key" style={{ width: '2rem', marginRight: '1rem' }} />
                  Courses
                </a>
              </li>
              {/* <li><a href="#contact" onClick={() => setToggleMenu(false)}>Contact</a></li> */}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
