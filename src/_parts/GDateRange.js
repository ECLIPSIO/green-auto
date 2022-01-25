import React, {useState} from "react";
import {RangeDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";


export default function GDateRange({target}){
    const [startDate, setStartDate] = useState(target.start ?? new Date());
    const [endDate, setEndDate] = useState(target.end ?? new Date());
    
    const dateChanges = (...data)=>{
        setStartDate(data[0]);
        setEndDate(data[1]);
        console.table(data);
    }
    return(
        <>
        <RangeDatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={dateChanges}
            dateFormat="D MMM YYYY"
            monthFormat="MMM YYYY"
            startDatePlaceholder={target.startPlace}
            endDatePlaceholder={target.endPlace}
            disabled={false}
            className={target.class}
            startWeekDay="monday"
            highlightToday={true}
        />
        </>
    )
}