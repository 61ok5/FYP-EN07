import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';
import './Table.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const {
    books,
    hasMore,
    loading,
    error,
  } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="app_table">
      <input className="searchBar" type="text" value={query} onChange={handleSearch} />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book.title}>{book.title}{book.id}</div>;
        }
        return (
          <div key={book.title} style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{book.title}</div>
            <div style={{ color: '#666666', marginBottom: '0.1rem' }}>{book.instructor}, {book.instructional_level}</div>
            <div style={{ color: '#666666', marginBottom: '0.1rem' }}>{(book.i_category !== null && (book.p_category || book.ps_category)) ? `${book.i_category} - ` : ''}{(book.p_category && book.p_category) ? `${book.p_category} - ` : ''}{book.ps_category}</div>
          </div>
        );
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Table.css';

// function Table() {
//   const [data, setData] = useState([]);
//   const [PageNumber, setPageNumber] = useState(1);
//   // const [RowsOfPage, setRowsOfPage] = useState(120);

//   function getData() {
//     const RowsOfPage = 50;
//     axios.get(`http://10.0.1.183/api/course/info/all?PageNumber=${PageNumber}&RowsOfPage=${RowsOfPage}`)
//       .then((response) => {
//         if (PageNumber > 1) {
//           const arr = [...data, ...response.data];
//           setData(arr);
//         } else {
//           setData(response.data);
//         }
//       })
//       .catch((error) => {
//         alert('Axios GET request failed\n', error);
//       });
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   const firstEvent = (e) => {
//     const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
//     if (bottom) {
//       const pg = PageNumber + 1;
//       setPageNumber(pg);
//       getData();
//     }
//   };

//   return (
//     <div onScroll={firstEvent} className="app_table">
//       <table>
//         {/* <thead>
//           <tr>
//             <th scope="col">Title</th>
//             <th scope="col">Photo</th>
//           </tr>
//         </thead> */}
//         <tbody>
//           {data.map((item) => (
//             <tr key={item.id}>
//               <td>{item.title}</td>
//               {/* <td><img src={item.thumbnailUrl} alt='' /></td> */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Table;
