import React, {useState, useEffect, useContext} from 'react';
import $ from 'jquery';

import {UserContext} from '../context/UserContext';

import axios from 'axios'; 

window.jQuery = $;
window.$ = $;
global.jQuery = $;

export default function ReviewForm(){

    const {user} = useContext(UserContext); 

    var scriptTexts;
    scriptTexts = [];
    scriptTexts.push("Hello name_value,\n\nWe are privileged to have your business at " + user.dealership + ".  If you have a minute, we'd love if you'd leave a review for us:\n\nreviewLink_value");

    const[scripts, setScripts] = useState(1);
    const[reviewUrl, setReviewUrl] = useState(user ? "https://g.page/" + user.gmaps_review_id + "/review" : "");

    const[currentScript, setCurrentScript] = useState("");
    const addScripts = () => {
        var s = scripts;
        s++;
        setScripts(s);
    }

    const protocol = window.location.protocol;

    const buildUrl = (formData) => {

        const text_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/twilio/review_text.php"; 

		return text_url;
	}

    const handleForm = (e) =>{
        // const formData = new FormData(e.target);
        // console.table('Form', formData);
        let reviewForm = document.getElementById('growReviewForm');
        const formData = new FormData(reviewForm);

        console.table('Form2', formData);

        const url = buildUrl(formData);

        axios.post(url, formData).then(function (response) {            
            console.log(response);

            if(response.data.success) alert("Text message sent!");
            else alert(response.data.error ? response.error : "An issue occured");
        });

        return false;
    }

    const updateScript = () => {
        
        let reviewForm = document.getElementById('growReviewForm');
        const formData = new FormData(reviewForm);

        var thisScript = scriptTexts[0];
        thisScript = thisScript.replace("name_value",formData.get("name"));
        thisScript = thisScript.replace("reviewLink_value",formData.get("reviewLink"));

        setCurrentScript(thisScript);
    }

    const manualScript = (e) => {
        setCurrentScript(e.target.value);
    }

    const manualUrl = (e) => {
        setReviewUrl(e.target.value);

        updateScript();
    }

    useEffect(() => {
        setReviewUrl(user ? "https://g.page/" + user.gmaps_review_id + "/review" : "");

        scriptTexts = [];
        scriptTexts.push("Hello name_value,\n\nWe are privileged to have your business at " + user.dealership + ".  If you have a minute, we'd love if you'd leave a review for us:\n\nreviewLink_value");

        let reviewForm = document.getElementById('growReviewForm');
        const formData = new FormData(reviewForm);

        var thisScript = scriptTexts[0];
        thisScript = thisScript.replace("name_value",formData.get("name"));
        thisScript = thisScript.replace("reviewLink_value","https://g.page/" + user.gmaps_review_id + "/review");

        setCurrentScript(thisScript);
        
    }, [user.dealership_id]);

    return (
        <>
        <div className="gray-box pl-0 pr-0">
            <div className="container-fluid plr-78">
                <div className="gmb-review-title text-uppercase mb-30">GROW 5-STAR REVIEWS</div>
                <div className="review-form-box">
                    <div className="m-title">Text your clients to grow your 5-Star Reviews, inviting clients to leave a review increases growth by 20%</div>
                    <form className="custom-form" method='post' onSubmit={(e)=>{e.preventDefault(); handleForm(e);}} id="growReviewForm">
                        <input type="hidden" name="twilio_number" value={user.twilio_number} />
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" className="form-control" defaultValue="John Smith" onChange={updateScript} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" name="phone" className="form-control" defaultValue="111-111-1111" />
                                </div>
                                <div className="form-group">
                                    <label>Google Review Link</label>
                                    <input type="text" name="reviewLink" className="form-control" value={reviewUrl} onChange={(e) => {manualUrl(e)} } />
                                </div>
                                <div className="form-group mb-15" id='scripts-block'>
                                    <label>Script</label>
                                    {Array.from({ length: scripts }, (_, index) => (
                                        <input type="text" name='scripts[]' className="form-control mb-1" value="Grow Google Reviews" key={'script-'+index} onChange={updateScript} />
                                    ))}
                                    
                                </div>
                                {/*<div className="form-group">
                                    <a href="#" className="add-script" onClick={(e) => {e.preventDefault();addScripts();}}><span>+</span> Add New Script</a>
                                </div>*/}
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Text Message</label>
                                    <textarea className="form-control" name="textBody" value={currentScript} onChange={(e) => {manualScript(e)} }></textarea>
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