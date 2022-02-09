// import React, {useState, useEffect} from 'react';
// import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
// import jQuery from 'jquery';

import HomeTabs from "../_parts/HomeTabs"
// import Modal from 'react-modal';
import FormModal from "../_parts/Modals";
export default function Home() {
    return(
        <>
        <section className='main-block'>
            <div className="container-fluid">
            <HomeTabs />
            </div>

        </section>
        </>
    )
}