import React, {useState} from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default function DateRange({target}){
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const handleDatesChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };
    return(
        <>
        <DateRangePicker
        startDate = {startDate} // momentPropTypes.momentObj or null,
        startDateId={target.start} // PropTypes.string.isRequired,
        endDate={endDate} // momentPropTypes.momentObj or null,
        endDateId={target.end} // PropTypes.string.isRequired,
        onDatesChange={handleDatesChange} // PropTypes.func.isRequired,
        focusedInput= {focusedInput}// PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
        />
        </>
    );
}