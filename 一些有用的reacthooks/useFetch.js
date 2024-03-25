import { useState, useEffect } from 'react';  
  
function useFetch(url) {  
  const [data, setData] = useState(null);  
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true);  
  
  // 使用React的ref来存储AbortController的实例  
  const controller = new AbortController();  
  const signal = controller.signal;  
  
  useEffect(() => {  
    let didCancel = false;  
  
    const fetchData = async () => {  
      try {  
        const response = await fetch(url, { signal }); // 使用signal来传递取消信号  
        if (!response.ok) {  
          throw new Error('Network response was not ok');  
        }  
        const json = await response.json();  
        if (!didCancel) {  
          setData(json);  
        }  
      } catch (error) {  
        if (error.name === 'AbortError') {  
          // 如果是被取消的请求，则不设置错误状态  
          console.log('Fetch aborted');  
        } else if (!didCancel) {  
          setError(error);  
        }  
      } finally {  
        if (!didCancel) {  
          setLoading(false);  
        }  
      }  
    };  
  
    fetchData();  
  
    // 清理函数，用于在组件卸载时取消请求  
    return () => {  
      didCancel = true;  
      controller.abort(); // 取消请求  
    };  
  }, [url]); // 当url变化时，重新发起请求  
  
  return { data, error, loading };  
}  
  
// 使用自定义Hook的的组件保持不变

export default useFetch