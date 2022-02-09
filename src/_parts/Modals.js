import React, { useState, useContext } from 'react';
import Modal from 'react-modal';

import {UserContext} from '../context/UserContext';

Modal.setAppElement('#root');

export default function LoginModal(props) {

    const {loginUser, wait, loggedInCheck} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [formData, setFormData] = useState({
        signin_username:'',
        signin_password:''
    });

    const onChangeInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const submitForm = async (e) => {
        e.preventDefault();

        if(!Object.values(formData).every(val => val.trim() !== '')){
            setErrMsg('Please Fill in all Required Fields!');
            return;
        }

        const data = await loginUser(formData);
        if(data.success){
            e.target.reset();
            setRedirect('Signing in...');
            await loggedInCheck();
            return;
        }
        setErrMsg(data.message);
    }

    const customStyles = {
            content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            }
        };

    return(
        <>
        <Modal
            id='login_modal'
            isOpen={props.isOpen}
            shouldCloseOnOverlayClick={true}
            style={customStyles}
            aria={{
                labelledby: "heading",
                describedby: "fulldescription"
            }}>
            <h1 id="heading" className='text-center mb-3'>Login Here</h1>
            <div id="fulldescription" tabIndex="0" role="document">
                {errMsg && <p className='text-center text-danger'>{errMsg}</p>}
                <form method='post' onSubmit={submitForm}>
                    <div className='form-group'>
                        <label htmlFor="username">Username</label>
                        <input type='text' placeholder='jondoe@gmail.com' id='username' name='signin_username' className='form-control' required onChange={onChangeInput}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input type='password' placeholder='Password' id='password' name='signin_password' className='form-control' required onChange={onChangeInput}/>
                    </div>
                    <div className="form-group">
                        <button type='button' className='btn btn-dark rounded' onClick={props.toggle}>Cancel</button>
                        {redirect ? redirect : <button type='submit' className='btn btn-success rounded float-right'>Sign In</button>}
                    </div>
                </form>
            </div>
            </Modal>
        </>
    )
}