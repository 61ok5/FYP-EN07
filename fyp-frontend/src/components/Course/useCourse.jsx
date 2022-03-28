import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useCourse(id) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [course, setCourse] = useState([]);

  useEffect(() => {
    setCourse([]);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `https://fyp-en07.hkrnd.com/api/course/info/${id}`,
      cancelToken: new axios.CancelToken((c) => { cancel = c; }),
    }).then((res) => {
      setCourse(() => res.data);
      setLoading(false);
    }).catch((e) => {
      if (axios.isCancel(e)) return;
      setError(true);
    });
    return () => cancel();
  }, [id]);

  return { loading, error, course };
}
