import React from 'react';
import ReactDOM from 'react-dom';
// import './App.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import UserContextProvider from './context/UserContext';


// import BarRaceChart from './components/BarRaceChart';

ReactDOM.render(
  <UserContextProvider>
    <App />
    {/* <Home /> */}
  </UserContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
