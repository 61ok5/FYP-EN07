import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

import { FooterOverlay } from '../../components';
import { images } from '../../constants';
import './Footer.css';

const Footer = () => (
  <div className="app__footer section__padding" id="login">
    <FooterOverlay />
    {/* <Newsletter /> */}

    <div className="app__footer-links">
      <div className="app__footer-links_contact">
        <h1 className="app__footer-headtext">Contact</h1>
        <p className="p__opensans">Year 4 INFE Student, City Unverisity of Hong Kong</p>
        <p className="p__opensans">Leung Tsz Lok</p>
        <p className="p__opensans">55695736</p>
      </div>

      <div className="app__footer-links_logo">
        <img src={images.gericht} alt="footer_logo" />
        <p className="p__opensans">&quot;Think big goals and win big success.&quot;</p>
        <img src={images.key} className="key__img" style={{ marginTop: 15 }} />
        <div className="app__footer-links_icons">
          <FiFacebook />
          <FiTwitter />
          <FiInstagram />
        </div>
      </div>

      <div className="app__footer-links_work">
        <h1 className="app__footer-headtext">Working Hours</h1>
        <p className="p__opensans">Monday - Friday:</p>
        <p className="p__opensans">08:45 am - 17:45 pm</p>
        <p className="p__opensans">Except:</p>
        <p className="p__opensans">Wedsnesday</p>
      </div>
    </div>

    <div className="footer__copyright">
      <p className="p__opensans">2022 Gericht. No Rights reserved.</p>
    </div>

  </div>
);

export default Footer;
