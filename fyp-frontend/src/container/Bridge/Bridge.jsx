import React from 'react';

import { images } from '../../constants';
import './Bridge.css';

const Bridge = () => (
  <div className="app__bridge section__padding" id="bridge">
    <div className="flex__center" style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', paddingBottom: '2rem' }}>
      <h1 className="p__cormorant_white" style={{ fontSize: '2rem', textShadow: '0px 0px 4px rgba(0, 0, 0, 0.6)', marginBottom: '1rem' }}>Cooperated with</h1>
      <img src={images.key} alt="key" className="key__img" />
    </div>
    <div className="flex__center" style={{ justifyContent: 'space-evenly', display: 'flex', flexWrap: 'wrap' }}>
      <img src={images.cityu} alt="cityu" style={{ padding: '1rem', width: '15rem' }} />
      <img src={images.sengital} alt="sengital" style={{ padding: '1rem', width: '15rem' }} />
      <img src={images.udemy} alt="udemy" style={{ padding: '1rem', width: '15rem' }} />
    </div>
    {/* <div className="app__bridge-overlay flex__center">
      <img src={images.G} alt="G_overlay" />
    </div>

    <div className="app__bridge-content flex__center">
      <div className="app__bridge-content_about">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra adipiscing ultrices vulputate posuere tristique. In sed odio nec aliquet eu proin mauris et.</p>
        <button type="button" className="custom__button">Know More</button>
      </div>

      <div className="app__bridge-content_knife flex__center">
        <img src={images.knife} alt="about_knife" />
      </div>

      <div className="app__bridge-content_history">
        <h1 className="headtext__cormorant">Our History</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">Adipiscing tempus ullamcorper lobortis odio tellus arcu volutpat. Risus placerat morbi volutpat habitasse interdum mi aliquam In sed odio nec aliquet.</p>
        <button type="button" className="custom__button">Know More</button>
      </div>
    </div> */}
  </div>
);

export default Bridge;
