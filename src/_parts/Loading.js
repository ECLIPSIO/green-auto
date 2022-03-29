import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import cogs from '../img/gears_green.svg';
Modal.setAppElement('#root');

export default function Loading(props) {
    const customStyles = {
            content: {
            top: '40%',
            left: '45%',
            right: 'auto',
            bottom: 'auto',
            padding: '50px 20px 20px 20px',
            marginRight: '-40%',
            background: '#353A40',
            transform: 'translate(-40%, -40%)',
            }
        };

    return(
        <>
        <Modal
            id='loading_modal'
            isOpen={props.isOpen}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
            aria={{
                labelledby: "heading",
                describedby: "fulldescription"
            }}>
            <h1 id="heading" className='text-center mb-3'>Loading</h1>
            <div id="fulldescription" tabIndex="0" role="document">
                <div className="float-points">
                    <div className="dot-collision"></div>
                </div>
                <div className="cog-block">
                    <img src={cogs} alt="cogs" className="cog-image" />
                    <p className="info">
                        This may take upto 5 seconds.<br/>
                        Please don't refresh the browser.
                    </p>
                </div>
            </div>
            </Modal>
        </>
    )
}