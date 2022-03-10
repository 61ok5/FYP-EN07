// import React, { useState, useEffect } from '@testing-library/user-event';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCourse from './useCourse';

// import Chip from '@mui/material/Chip';
// import { Link } from 'react-router-dom';
import './Course.css';

const Course = () => {
  const { id } = useParams();

  

  return (
    <div style={{ position: 'absolute' }}>
      {course[0].description}
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
