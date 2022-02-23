import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Header.css';

const Header = () => (
  <div className="app__header app__wrapper section__padding app__headerbg" id="home" style={{ paddingTop: '8rem' }}>
    <div className="app__wrapper_info">
      <SubHeading title="Key To Success" />
      <h1 className="app__header-h1" style={{ textShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)' }}>Independent Learning</h1>
      <p className="p__opensans_white" style={{ margin: '2rem 0' }}>Professional mechanical learning algorithms and appropriate course recommendations<br />to unleash your potential. Your future depends on your dreams! </p>
      <button type="button" className="custom__button p__opensans_white" style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.6' }}>Menu</button>
    </div>

    <div className="app__wrapper_img">
      <img src={images.recom} alt="header_img" />
    </div>
  </div>
);

export default Header;
