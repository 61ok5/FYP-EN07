import React from 'react';
import { BsInstagram, BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { images } from '../../constants';
import './Gallery.css';

const Gallery = () => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;

    if (direction === 'left') {
      current.scrollLeft -= 300;
    } else {
      current.scrollLeft += 300;
    }
  };

  return (
    <div className="app__gallery flex__center">
      <div className="app__gallery-content">
        <div style={{ marginBottom: '1rem' }}>
          <p className="p__opensans" style={{ color: '#666666', fontSize: '2rem', lineHeight: '4rem' }}>The best of the best</p>
          <img src={images.key} alt="key_image" className="key__img" />
        </div>
        <h1 className="headtext__cormorant" style={{ fontSize: '5rem', marginBottom: '1rem', lineHeight: '6rem' }}>Top 10 Courses</h1>
        <p className="p__opensans" style={{ color: '#888888', marginTop: '2rem', marginBottom: '2rem' }}>Top 10 courses recommended by deep learning algorithms based on user reviews.</p>
        <button type="button" className="custom__button p__opensans_white" style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.6)' }}>View More</button>
      </div>
      <div className="app__gallery-images">
        <div className="app__gallery-images_container" ref={scrollRef}>
          {[images.gallery01, images.gallery02, images.gallery03, images.gallery04].map((image, index) => (
            <div className="app__gallery-images_card flex__center" key={`gallery_image-${index + 1}`}>
              <img src={image} alt="gallery_image" />
              <BsInstagram className="gallery__image-icon" />
            </div>
          ))}
        </div>
        <div className="app__gallery-images_arrows">
          <BsArrowLeftShort className="gallery__arrow-icon" onClick={() => scroll('left')} />
          <BsArrowRightShort className="gallery__arrow-icon" onClick={() => scroll('right')} />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
