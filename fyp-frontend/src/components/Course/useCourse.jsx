import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useCourse() {
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [course, setCourse] = useState([]);

  useEffect(() => {
    console.log(loading);
    console.log(error);
  }, [course]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `http://10.0.1.183/api/course/info/${id}`,
      cancelToken: new axios.CancelToken((c) => { cancel = c; }),
    }).then((res) => {
      setCourse(() => res.data);
      setLoading(false);
    }).catch((e) => {
      if (axios.isCancel(e)) return;
      setError(true);
    });
    return () => cancel();
  }, []);

  return { loading, error, course };
}
