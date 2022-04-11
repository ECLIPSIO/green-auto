import React, {useState, useEffect} from 'react';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;

export default function Form(){

    const[scripts, setScripts] = useState(1);
    const addScripts = () => {
        var s = scripts;
        s++;
        setScripts(s);
    }

    const handleForm = (e) =>{
        // const fData = new FormData(e.target);
        // console.table('Form', fData);
        const fData = {
            name: e.target[0].value,
            phone: e.target[1].value,
            link: e.target[2].value,
            scripts: e.target[3].value,
            msg: e.target[4].value,
        };
        console.table('Form2', fData);
        return false;
    }
    return (
        <>
        <div className="gray-box pl-0 pr-0">
            <div className="container-fluid plr-78">
                <div className="gmb-review-title text-uppercase mb-30">GROW 5-STAR REVIEWS</div>
                <div className="review-form-box">
                    <div className="m-title">Text your clients to grow your 5-Star Reviews, inviting clients to leave a review increases growth by 20%</div>
                    <form className="custom-form" method='post' onSubmit={(e)=>{e.preventDefault(); handleForm(e);}}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" className="form-control" value="John Smith"/>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" className="form-control" value="561-734-8820"/>
                                </div>
                                <div className="form-group">
                                    <label>Google Review Link</label>
                                    <input type="text" className="form-control" value="https://g.page/r/CYz0i2ENld8vEAg/review"/>
                                </div>
                                <div className="form-group mb-15" id='scripts-block'>
                                    <label>Script</label>
                                    {Array.from({ length: scripts }, (_, index) => (
                                        <input type="text" name='scripts[]' className="form-control mb-1" value="Grow Google Reviews" key={'script-'+index}/>
                                    ))}
                                    
                                </div>
                                <div className="form-group">
                                    <a href="#" className="add-script" onClick={(e) => {e.preventDefault();addScripts();}}><span>+</span> Add New Script</a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Text Message</label>
                                    <textarea className="form-control"></textarea>
                                </div>
                            </div>
                            <div className="col-12 text-right">
                                <button type='submit' className="green-btn">Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}