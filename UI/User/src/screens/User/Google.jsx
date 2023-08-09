import { useEffect } from 'react';

function Google() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=b1afb0f7ac69e4f51';
    script.async = true;
    document.body.appendChild(script);
    const searchContainer = document.getElementById('___gcse_0');
    if (searchContainer) {
      searchContainer.style.width = '100%';
    }

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div  className="gcse-search"></div>;
}

export default Google;