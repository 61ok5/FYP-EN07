import React from 'react';

import { images } from '../../constants';

const SubHeading = ({ title }) => (
  <div style={{ marginBottom: '1rem' }}>
    <p className="p__cormorant_white" style={{ textShadow: '0px 0px 4px rgba(0, 0, 0, 0.95)' }}>{title}</p>
    <img src={images.key} alt="key_image" className="key__img" />
  </div>
);

export default SubHeading;
