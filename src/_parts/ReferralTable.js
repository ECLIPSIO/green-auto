import React, { useState, useEffect } from "react";
import RenderReferral from "./RenderReferral";

const dataAtonce = 10;
let dataStack = [];

const ReferralTable = ({referralData}) => {
    referralData = Object.values(referralData);
    const length = referralData.length;
    const [dataToShow, setDataToShow] = useState([]);
    const [anchor, setAnchor] = useState(10);

    const collectNextData = (start, end) => {
        const slicedData = referralData.slice(start, end);
        dataStack = [...dataStack, ...slicedData];
        setDataToShow(dataStack);
    }

    useEffect(() => {
        collectNextData(0, dataAtonce);
    },[]);

    const handleLoadMore = () => {
        if(length >= (anchor + dataAtonce)){
            collectNextData(anchor, anchor + dataAtonce);
            setAnchor(anchor + dataAtonce);
        } else if(length - anchor > 0){
            collectNextData(anchor, anchor + (length - anchor + 1));
            setAnchor(anchor + (length - anchor + 1));
        }
    }

    return (
        <div className="cs-table-block">
            <RenderReferral referralData={dataToShow}/>
            <div className="text-center mt-35">
                <a href="#" className="green-small-btn" onClick={(e) => {e.preventDefault(); handleLoadMore();}}>Show 10 More</a>
            </div>
        </div>
    )
}

export default ReferralTable;