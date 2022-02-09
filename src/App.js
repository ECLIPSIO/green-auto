import './css/all.css';
import './css/owl.carousel.min.css';
import './css/bootstrap.min.css';
import './css/style.css';
import './css/responsive.css';

// import jQuery from 'jquery';
// import './js/jquery-3.6.0.min.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import React, {useState, useEffect} from 'react'; 
// import React from 'react';
// import { Helmet } from 'react-helmet';

import Header from './_parts/Header';
import Home from './Pages/Home';
import Footer from './_parts/Footer';

import './js/popper.min.js';
import './js/moment.min.js';
import './js/bootstrap.min.js';
// require('./js/popper.min.js');
// require('./js/moment.min.js');
// require('./js/bootstrap.min.js');
// require('bootstrap');
import {useEffect, useContext, useState} from 'react'
import {UserContext} from './context/UserContext';


function App() {

  const {user, loggedInCheck} = useContext(UserContext); 

  const [currDealership, setCurrDealership] = useState(null);

  const [checkedLogin, setCheckedLogin] = useState(null);

  console.log("triggered during render");

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!checkedLogin) {
      checkLogin();
    }
  }, []);

  const checkLogin = async () => {
    console.log('checking login');
    await loggedInCheck();
    setCheckedLogin(true)
    console.log(user);
  }

  return (
    <Router>
      {checkedLogin && (<Header callBack={setCurrDealership}/>)}
      <Routes>
        {checkedLogin && user ? (<Route exact path="/reporting/" element={<Home />}/>) : (<Route exact path="/reporting/"/>)}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
