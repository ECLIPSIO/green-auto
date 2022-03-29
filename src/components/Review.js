import React, {useState, useEffect} from 'react';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
import ReviewBlock from './ReviewBlock';

export default function Review({reviewData}) {
    useEffect(() => {
        // console.table(reviewData);
    }, []);
    return (
        <div className="gray-box pl-0 pr-0">
			<div className="container-fluid plr-78">
                {reviewData && reviewData.map((r, i) => {
                    return <ReviewBlock review={r} key={'1000'+i}/>
                })}
            </div>
        </div>
    )
}