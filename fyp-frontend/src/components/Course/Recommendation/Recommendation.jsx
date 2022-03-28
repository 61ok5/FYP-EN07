import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { BsInstagram, BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

// import { images } from '../../../constants';
import './Recommendation.css';

const Recommendation = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(data);
    // setData([]);
  }, [data]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `https://fyp-en07.hkrnd.com/api/course/result?preload=1&mode=1&toDB=0&id=${id}`,
      // params: { preload: 1, num: 10 },
      cancelToken: new axios.CancelToken((c) => { cancel = c; }),
    }).then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch((e) => {
      if (axios.isCancel(e)) return;
      setError(true);
    });
    return () => cancel();
  }, []);

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
    <div className="app__recommendation flex__center">
      <div className="app__recommendation-content">
        <div style={{ marginBottom: '4rem' }}>
          <p className="p__opensans" style={{ color: '#666666', fontSize: '2rem', lineHeight: '4rem' }}>Recommended Courses</p>
          {/* <img src={images.key} alt="key_image" className="key__img" /> */}
        </div>
        {/* <h1 className="headtext__cormorant" style={{ fontSize: '5rem', marginBottom: '1rem', lineHeight: '6rem' }}>Top 10 Courses</h1>
        <p className="p__opensans" style={{ color: '#888888', marginTop: '2rem', marginBottom: '2rem' }}>Top 10 courses recommended by deep learning algorithms based on user reviews.</p>
        <button type="button" className="custom__button p__opensans_white" style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.6)' }}>View More</button> */}
      </div>
      <div className="app__recommendation-images">
        <div className="app__recommendation-images_container" ref={scrollRef}>
          {(loading === false && error === false) ? data.map((result, index) => (
            <Link to={`/course/${result.id}`}>
              <div className="app__recommendation-images_card flex__center" style={{ alignItems: 'flex-end' }} key={`recommendation_image-${index + 1}`}>
                <img src={result.image_750x422} alt="recommendation_image" />
                <div className="p__cormorant_white" style={{ fontSize: '1rem', textShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', paddingLeft: '1rem', paddingTop: '0.5rem', width: '100%', height: '7rem', position: 'absolute', background: 'rgba(0, 0, 0, 0.3)' }}>
                  {result.title}
                </div>
              </div>
            </Link>
          )) : 'pending...'}
        </div>
        <div className="app__recommendation-images_arrows">
          <BsArrowLeftShort className="recommendation__arrow-icon" onClick={() => scroll('left')} />
          <BsArrowRightShort className="recommendation__arrow-icon" onClick={() => scroll('right')} />
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
