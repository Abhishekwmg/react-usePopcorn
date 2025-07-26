import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App-V1';
// import App from './App';
// import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} color="#DFFF00" size="120" defaultRating={3} /> */}
  </React.StrictMode>
);
;
