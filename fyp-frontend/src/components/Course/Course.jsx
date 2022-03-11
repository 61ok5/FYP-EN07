import React, { useState, useEffect } from 'react';
// import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
// import useCourse from './useCourse';
// import Chip from '@mui/material/Chip';
// import { Link } from 'react-router-dom';
import './Course.css';

const Course = () => {
  const { id } = useParams();

  const [course, setCourse] = useState([]);

  const initCourse = async () => {
    const response = await axios({
      method: 'GET',
      url: `http://10.0.1.183/api/course/info/${id}`,
    });
    // response.data[0].description = response.data[0].description.replace(/<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});/gi, '');
    // response.data.response[0].category = response.data.response[0].category.replace(/[^a-z, ']/gi, '');
    setCourse(response.data[0]);
  };

  useEffect(() => {
    initCourse();
  }, [id]);

  useEffect(() => {
    console.log(course.rating);
  }, [course]);

  return (
    <div className="app_course">
      <div className="course_bg">
        <div className="course_content" key={course.title}>
          <div className="course_img">
            <img src={course.image_750x422} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="course_head">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</div>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{course.headline}</div>
            <div style={{ fontSize: '1.25rem', color: '#444444', marginBottom: '0.4rem' }}>{course.instructor}, {course.instructional_level}</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ fontSize: '1.5rem', color: '#ad901f', marginRight: '1rem' }}>{course.rating}</div>
              <StarRatingComponent name="rating" starCount={5} value={course.rating} editing={false} />
            </div>
            <div style={{ fontSize: '1rem', color: '#666666', marginBottom: '1rem' }}>{(course.i_category !== null && (course.p_category || course.ps_category)) ? `${course.i_category} - ` : ''}{(course.p_category && course.p_category) ? `${course.p_category} - ` : ''}{course.ps_category}</div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{course.price}</div>
          </div>
        </div>
      </div>
      <div className="course_description" dangerouslySetInnerHTML={{ __html: course.description }} />
    </div>
  );
  //   const Course = ({ match }) => {
  //     const {
  //       params: { product_id },
  //     } = match;

  //    const [product, setProduct] = useState([]);
  //    const [productId, setProductId] = useState(match.params.product_id);
  //     const [categoryArray, setCategoryArr] = useState([])

  //     const initProduct = async () => {
  //       const response = await API.get_product_by_id(match.params.product_id);
  //       response.data.response[0].category = response.data.response[0].category.replace(/["]/gi, ' ');
  //     response.data.response[0].category = response.data.response[0].category.replace(/[^a-z, ']/gi, '');
  //     var categoryArray = response.data.response[0].category.split(",");
  //     setCategoryArr(categoryArray)
  //     setProduct(response.data.response[0]);
  //   };

  //   useEffect(() => {
  //     initProduct();
  //   }, [product_id]);

  //   const { trackPageView, trackEvent } = useMatomo()
  //   React.useEffect(() => {
  //     if(productId)
  //       trackPageView({
  //         documentTitle: productId,
  //       })
  //   }, [productId])

  //   return (
  //     <div style={{padding: "2rem 4rem"}}>

  //       <h4 className="spec-product-breadcrumb">
  //         <Link to="/" style={{textDecoration: "none", color: "white"}}>ABC STORE </Link>
  //         <ChevronRightIcon />
  //         <Link to="/all_products" style={{textDecoration: "none", color: "white"}}>Product List </Link>
  //         <ChevronRightIcon />
  //       </h4>
  //       <h1 style={{margin: "25px 0px 15px 0px"}}>{product.name}</h1>
  //       {categoryArray.map(category => (
  //         <Chip label={category}
  //           color="primary" variant="outlined"
  //           className="spec-product-chip" />
  //       ))}
  //       <div className="spec-product-wrapper">
  //         <Image className="spec-product-img" src={product.image} h={280} onError={(e)=>{e.target.onerror = null; e.target.src="https://freesvg.org/img/linked4.png"}}/>
  //         <h2 className="spec-product-price">price: ${product.price}</h2>
  //       </div>
  //       {/* <Link to="/">Back to homepage</Link><br/> */}
  //       {/* <Link to="/all_products">View all products</Link> */}
  //     </div>
  //   );
};

export default Course;
