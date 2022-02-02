import React, { Component } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');
class FormModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: props.openOnLoad
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
  
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
    render() {
        const customStyles = {
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
        };
        return(
            <>
            <Modal
                id='login_modal'
                isOpen={this.state.showModal}
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                aria={{
                    labelledby: "heading",
                    describedby: "fulldescription"
                }}>
                <h1 id="heading" className='text-center mb-3'>Login Here</h1>
                <div id="fulldescription" tabIndex="0" role="document">
                    <p className='text-center text-danger'>Please use valid credentials</p>
                    <form method='post'>
                        <div className='form-group'>
                            <label htmlFor="email">Email</label>
                            <input type='email' placeholder='jondoe@gmail.com' id='email' name='email' className='form-control' required/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password">Password</label>
                            <input type='password' placeholder='Password' id='password' name='password' className='form-control' required/>
                        </div>
                        <div className="form-group">
                            <button type='button' className='btn btn-dark rounded' onClick={this.handleCloseModal}>Cancel</button>
                            <button type='button' className='btn btn-success rounded float-right'>Sign In</button>
                        </div>
                    </form>
                </div>
                </Modal>
            </>
        )
    }
}

export default FormModal;