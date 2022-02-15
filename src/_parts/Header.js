import {useState, useContext, useEffect} from 'react';
import { NavLink, Link } from 'react-router-dom';

import jQuery from 'jquery';
// import { Helmet } from 'react-helmet';
// import { useLocation } from 'react-router-dom';

import logo from '../img/GAS-Logo.svg';
import user_icon  from '../img/icon-user.png';

import LoginModal from "../_parts/Modals";

import {UserContext} from '../context/UserContext';

// require('bootstrap');

const openMobileMenu = (e) => {
    jQuery('.mobile-inner-header-icon').toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
    jQuery(".main-menu").toggleClass("active");
    jQuery('body').toggleClass('overflow-active');
    jQuery('.overlay-bg').toggleClass('active');
};

// const overlayBG = (e) => {
//     jQuery(".mobile-inner-header-icon-click").toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
//     jQuery(".main-menu").removeClass("active");
//     jQuery('body').removeClass('overflow-active');
//     jQuery('.overlay-bg').removeClass('active');
// };
export default function Header(props){
    const {user, changeUserDealership, logout} = useContext(UserContext); 
    
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        console.log("Header.js useeffect");

        if(user) setShowModal(false);
        //setShowModal(!user);
    });    

    const toggleModal = () => {
        console.log("called toggle modal");
        setShowModal(!showModal)
    }

    const changeDealership = (dealership_id,dealership) => {
        changeUserDealership(dealership_id,dealership);
        props.callBack(dealership_id);
    }
    return(
        <>
        {showModal && (<LoginModal isOpen={showModal} toggle={toggleModal}/>)}
        <header className="header-wrap">
            <div className="container-fluid">
                <div className="header-block">
                    <div className="header-left">
                    <NavLink to="/"><img src={logo} className="main-logo" alt='GAS' /></NavLink>
                    </div>
                    <div className="header-right">
                        <div className="main-menu">
                            <ul>
                                <li>
                                    <NavLink exact="true" to="/reporting">Dashboard</NavLink>
                                </li>
                                <li>
                                    <a href="#">Leads</a>
                                </li>
                                <li>
                                    <a href="#">Tasks</a>
                                </li>
                                <li>
                                    <a href="#">Tools</a>
                                </li>
                                <li>
                                    <a href="#">Report</a>
                                </li>
                                <li>
                                    <a href="#">Menu Item</a>
                                </li>
                                {!user && <li>
                                    <a href="#" onClick={() => toggleModal()}>Log In</a>
                                </li>}
                            </ul>
                        </div>
                        <div className="login-block login-for-desktop">
                            <div className="btn-group custom-dropdown">
                                {
                                    user &&
                                    (<button type="button" className="btn btn-secondary dropdown-toggle text-green" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={user_icon} alt="GAS - User"/> {user.dealership}
                                    </button>)
                                } 
                                {user && user.role == "admin" ? <div className="dropdown-menu dropdown-menu-right">                                    
                                    <button className="dropdown-item" type="button" onClick={() => changeDealership('bulauto','Bul Auto Sales')}>Bul Auto Sales</button>
                                    <button className="dropdown-item" type="button" onClick={() => changeDealership('gcalfa','Gold Coast Alfa Romeo')}>Gold Coast Alfa Romeo</button>
                                    <button className="dropdown-item" type="button" onClick={() => changeDealership('gcmaserati','Gold Coast Maserati')}>Gold Coast Maserati</button>
                                    <button className="dropdown-item" type="button" onClick={() => changeDealership('manheimimports','Manheim Imports')}>Manheim Imports</button>
                                    <button className="dropdown-item" type="button" onClick={() => changeDealership('mclarenorlando','McLaren Orlando')}>McLaren Orlando</button>
                                    <button className="dropdown-item" type="button" onClick={() => logout()}>Log Out</button>
                                </div> : (user && <div className="dropdown-menu dropdown-menu-right"><button className="dropdown-item" type="button" onClick={() => logout()}>Log Out</button></div>)}
                            </div>
                        </div>
                        <div className="mobile-inner-header">
                            <div className="mobile-inner-header-icon mobile-inner-header-icon-out" onClick={openMobileMenu}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        </>
    )
}