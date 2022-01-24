import './css/all.css';
import './css/owl.carousel.min.css';
import './css/bootstrap.min.css';
import './css/style.css';
import './css/responsive.css';

// import jQuery from 'jquery';
// import './js/jquery-3.6.0.min.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/reporting/" element={<Home />}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
