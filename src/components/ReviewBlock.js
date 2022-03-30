import React, {useState, useEffect} from 'react';
import porscheLogo from '../img/porsche-logo.png';
import xIcon from '../img/icon-x.svg';
export default function ReviewBlock({review}){
    
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
            if(checked)
            {
                elem.push(<span className="fas fa-star checked" key={'stars'+i}></span>);
            } else {
                elem.push(<span className="fas fa-star" key={'stars'+i}></span>);
            }
        }
        return elem;
    }
    const [reply, setReply] = useState(false);

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
                <div className="review-circle">{fLetter(review.name)}</div>
                <div className="reviewer-info">
                    <div className="reviewer-name">{review.name}</div>
                    <div className="d-flex align-items-center">
                        <div className="rating-box">
                            {createStars(Math.round(review.rating), true)}
                            {createStars((5 - Math.round(review.rating)))}
                        </div>
                        <div className="review-date text-uppercase">{review.time}</div>
                    </div>
                    <p>{review.review}</p>
                    <div className="text-right mt-20">
                        {!reply ? <a href="" className="green-transparent-btn jq_replay_btn" onClick={e => {e.preventDefault(); setReply(true)}}>REPLY</a> : null}
                        
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
                            <a href="" className="transparent-btn" onClick={e => {e.preventDefault(); setReply(false)}}>Cancel</a>
                            <a href="" className="green-btn" onClick={e => {e.preventDefault();}}>Post Reply</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}