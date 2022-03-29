import React, {useState, useEffect} from 'react';
import porscheLogo from '../img/porsche-logo.png';
import xIcon from '../img/icon-x.svg';
export default function ReviewBlock({review}){
    
    const fLetter = (name) => {
        return name.charAt(0);
    }

    const [reply, setReply] = useState(false);

    useEffect(() => {
        // console.table(review);
    }, [])
    return (
        <div className={`${reply ? 'review-box d-active' : 'review-box'}`}>
            <a href="javascript:void(0);" className="review-cross-icon" onClick={e => {setReply(false)}}><img src={xIcon}/></a>
            <div className="reviewer-info-flex d-flex">
                <div className="review-circle">{fLetter(review.name)}</div>
                <div className="reviewer-info">
                    <div className="reviewer-name">{review.name}</div>
                    <div className="d-flex align-items-center">
                        <div></div>
                        <div className="review-date text-uppercase">{review.time}</div>
                    </div>
                    <p>{review.review}</p>
                    <div className="text-right mt-20">
                        {!reply ? <a href="javascript:void(0);" className="green-transparent-btn jq_replay_btn" onClick={e => {setReply(true)}}>REPLY</a> : null}
                        
                    </div>
                </div>
            </div>
            <div className="reviewer-info-flex replay-field-block">
                <div className="d-flex">
                    <div className="review-circle"><img src={porscheLogo}/></div>
                    <div className="reviewer-info">
                        <div className="reviewer-name mt-20">South Florida Porsche Dealership</div>
                        <div className="write-label mt-15">Write your Reply</div>
                        <div className="write-review-box mt-8">
                            <textarea className="write-review-control"></textarea>
                            <div className="wr-info">Please note that your reply will be displayed publicly on google and must comply with the local content policies and <a href="">terms of service</a></div>
                        </div>
                        <div className="text-right mt-20">
                            <a href="javascript:void(0)" className="transparent-btn" onClick={e => {setReply(false)}}>Cancel</a>
                            <a href="javascript:void(0)" className="green-btn">Post Reply</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}