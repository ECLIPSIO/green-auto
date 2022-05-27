import React, { useState, useEffect } from "react";
import RenderSeo from "./RenderSeo";
import RenderReferral from "./RenderReferral";
import RenderIntercept from "./RenderIntercept";
import RenderTraffic from "./RenderTraffic";
import RenderAdGroup from "./RenderAdGroup";

const dataAtonce = 10;
let moreTableDataStack = {
    seo: [],
    referral: [],
    intercept: [],
    traffic: [],
    ad_group: []
};

const components = {
    seo: RenderSeo,
    referral: RenderReferral,
    intercept: RenderIntercept,
    traffic: RenderTraffic,
    ad_group: RenderAdGroup
};

export default function MoreTable(props) {
    const length = Object.keys(props.tableData).length;

    const [dataToShow, setDataToShow] = useState([]);
    const [anchor, setAnchor] = useState(10);

    const collectNextData = (start, end) => {
        const slicedData = props.tableData.slice(start, end);
        moreTableDataStack[props.tableType] = [...moreTableDataStack[props.tableType], ...slicedData];
        setDataToShow(moreTableDataStack[props.tableType]);
    }

    const SpecificTable = components[props.tableType];

    useEffect(() => {
        console.log("MoreTable useeffect");
        moreTableDataStack[props.tableType] = [];
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
            <SpecificTable tableData={dataToShow}/>
            <div className="text-center mt-35">
                <a href="#" className="green-small-btn" onClick={(e) => {e.preventDefault(); handleLoadMore();}}>Show 10 More</a>
            </div>
        </div>
    )
}

