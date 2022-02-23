import React from 'react';

import { images } from '../../constants';
import './AboutUs.css';

const AboutUs = () => (
  <div className="app__aboutus app__aboutusbg section__padding" id="topics">
    <h1 className="p__cormorant_white_blackboard flex__center" style={{ fontWeight: '400', fontSize: '5.5rem', marginBottom: '2rem', lineHeight: '6rem' }}>Popular Course Topics</h1>
    <div className="flex__center">
      <div className="flex__center" style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ margin: '2rem' }}>
          <img src={images.design} alt="design" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Design</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.development} alt="development" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Development</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.marketing} alt="marketing" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Marketing</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.software} alt="software" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>IT & Software</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.personal} alt="personal" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Personal Development</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.business} alt="business" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Business</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.photography} alt="photography" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Photography</p>
        </div>
        <div style={{ margin: '2rem' }}>
          <img src={images.music} alt="music" />
          <p className="p__cormorant_white_blackboard" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Music</p>
        </div>
      </div>
    </div>
    {/* <div className="app__aboutus-overlay flex__center">
      <img src={images.G} alt="G_overlay" />
    </div>

    <div className="app__aboutus-content flex__center">
      <div className="app__aboutus-content_about">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra adipiscing ultrices vulputate posuere tristique. In sed odio nec aliquet eu proin mauris et.</p>
        <button type="button" className="custom__button">Know More</button>
      </div>

      <div className="app__aboutus-content_knife flex__center">
        <img src={images.knife} alt="about_knife" />
      </div>

      <div className="app__aboutus-content_history">
        <h1 className="headtext__cormorant">Our History</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">Adipiscing tempus ullamcorper lobortis odio tellus arcu volutpat. Risus placerat morbi volutpat habitasse interdum mi aliquam In sed odio nec aliquet.</p>
        <button type="button" className="custom__button">Know More</button>
      </div>
    </div> */}
  </div>
);

export default AboutUs;
