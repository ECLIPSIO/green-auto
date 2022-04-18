import React, {useState, useEffect} from 'react';
import xIcon from '../img/icon-x.svg';

import axios from 'axios'; 

export default function ReviewBlock({review,user}){
    
    const[stars, setStars] = useState(5);
    const[checked, setChecked] = useState(0);
    const fLetter = (name) => {
        return name.charAt(0);
    }

    const checkStar = [];
    const unCheckedStart = [];
    const createStars = (count, checked = false) => {
        const elem = [];
        for(let i = 0; i<count; i++){
            if(checked) {
                elem.push(<span className="fas fa-star checked" key={'stars'+i}></span>);
            } else {
                elem.push(<span className="fas fa-star" key={'stars'+i}></span>);
            }
        }
        return elem;
    }
    const [reply, setReply] = useState(false);
    const [hasReply, setHasReply] = useState(review.reviewReply !== undefined);

    const protocol = window.location.protocol;

    const buildUrl = (action,reviewId) => {

        const business_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_business_reviews.php"; 

		var build_url = business_url + "?dealership=" + user.dealership_id + "&reply_action=" + action + "&review_id=" + reviewId;

		console.log(build_url);

		return build_url;
	}

    const replyToReview = (reviewId,comment) => {

        const url = buildUrl("reply",reviewId) + "&comment=" + comment;
        
        axios.get(url).then(function (response) {            
            console.log(response);
        });

        review.reviewReply = {"comment" : comment};

        setReply(false);
        setHasReply(true);
    }

    const deleteReply = (reviewId) => {

        const url = buildUrl("delete",reviewId);
        
        axios.get(url).then(function (response) {            
            console.log(response);
        });

        delete review.reviewReply;

        setReply(reply);
        setHasReply(false);
    }

    useEffect(() => {
        // console.table(review);
        if(review && review.rating !== undefined){
            const star = Math.round(review.rating);
            setStars(5 - star);
            setChecked(star);
        }
    }, [])
    return (
        <div className={`${reply ? 'review-box d-active' : 'review-box'}`}>
            <a href="" className="review-cross-icon" onClick={e => {e.preventDefault(); setReply(false)}}><img src={xIcon}/></a>
            <div className="reviewer-info-flex d-flex">
                <div className="review-circle">{fLetter(review.reviewer.displayName)}</div>
                <div className="reviewer-info">
                    <div className="reviewer-name">{review.reviewer.displayName}</div>
                    <div className="d-flex align-items-center">
                        <div className="rating-box">
                            {createStars(Math.round(review.rating), true)}
                            {createStars((5 - Math.round(review.rating)))}
                        </div>
                        <div className="review-date text-uppercase">{review.time}</div>
                    </div>
                    <p>{review.comment}</p>
                    {review && review.reviewReply && review.reviewReply.comment !== undefined && <div><br/><p>Your Reply - {review.reviewReply.comment}</p></div>}
                    <div className="text-right mt-20">
                        {review && review.reviewReply !== undefined && <a href="" className="green-transparent-btn jq_replay_btn" onClick={e => {e.preventDefault(); deleteReply(review.reviewId)}}>DELETE REPLY</a>}
                        {!reply && <a href="" className="green-transparent-btn jq_replay_btn" onClick={e => {e.preventDefault(); setReply(true)}}>{hasReply ? "UPDATE REPLY" : "REPLY"}</a>}                       
                    </div>
                </div>
            </div>
            <div className="reviewer-info-flex replay-field-block">
                <div className="d-flex">
                    <div className="review-circle">{fLetter(user.dealership)}</div>
                    <div className="reviewer-info">
                        <div className="reviewer-name mt-20">{user.dealership}</div>
                        <div className="write-label mt-15">Write your Reply</div>
                        <div className="write-review-box mt-8">
                            <textarea className="write-review-control" id={review.reviewId} value={review && review.reviewReply && review.reviewReply.comment !== undefined ? review.reviewReply.comment : ""}></textarea>
                            <div className="wr-info">Please note that your reply will be displayed publicly on google and must comply with the local content policies and <a href="https://support.google.com/business/answer/9292476?hl=en" target="_BLANK">terms of service</a></div>
                        </div>
                        <div className="text-right mt-20">
                            <a href="" className="transparent-btn" onClick={e => {e.preventDefault(); setReply(false)}}>Cancel</a>
                            <a href="" className="green-btn" onClick={e => {e.preventDefault(); replyToReview(review.reviewId,document.getElementById(review.reviewId).value)}}>Post Reply</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}