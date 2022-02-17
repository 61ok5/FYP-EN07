import React from 'react';

import { images } from '../../constants';

const SubHeading = ({ title }) => (
  <div style={{ marginBottom: '1rem' }}>
    <p className="p__cormorant_white">{title}</p>
    <img src={images.key} alt="key_image" className="key__img" />
  </div>
);

export default SubHeading;
