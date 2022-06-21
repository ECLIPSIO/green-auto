import $ from 'jquery';
import dateIcon from '../img/ico-date.svg';
import closeIcon from '../img/ico-close.svg';
import greenUp from '../img/green-arrow-up.svg';
import greenAdd from '../img/green_add_circle.svg';
import redDown from '../img/red-arrow-down.png';
import { useState } from 'react';
import {RangeDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";

window.jQuery = $;
window.$ = $;
global.jQuery = $;
export default function WeekStats({statData}){
    const[metrics, setMetrics] = useState(0);
    const ttl = statData.length;
    const hideShowRow = (i) => {
        const t = $('input#metCheckbox-'+i);
        console.log('t', i);
        if(t.is(':checked')){
            // console.log('Hide-'+i);
            $('tr#metRow-'+i).hide();
        } else {
            // console.log('Show-'+i);
            $('tr#metRow-'+i).show();
        }
    }
    const generateHideOptions = () => {
        let elem = [];
        console.log('len', ttl);
        for(let i=1; i<=ttl; i++){
            elem.push(<div className="dropdown-item">
                <div className="custom-checkbox">
                    <input className="styled-checkbox" id={"metCheckbox-"+i} type="checkbox" value={i} onChange={(e) => {hideShowRow(e.target.value)}}/>
                    <label htmlFor={"metCheckbox-"+i}>Metric {i}</label>
                </div>
            </div>);
        }
        return elem;
    }

    var tempStartDate = new Date(); 
	if(tempStartDate.getDate() >= 7) tempStartDate.setDate(1);
	else {
		tempStartDate.setMonth(tempStartDate.getMonth() - 1);
		tempStartDate.setDate(1);
	}
	tempStartDate.setHours(0,0,0,0);
	const [currStartDate, setCurrStartDate] = useState(tempStartDate);

	var tempEndDate = new Date();
	if(tempEndDate.getDate() < 7) tempEndDate.setDate(0);
	tempEndDate.setHours(0,0,0,0);
	const [currEndDate, setCurrEndDate] = useState(tempEndDate);

	var tempHStartDate = new Date(tempStartDate.getTime());
	tempHStartDate.setMonth(tempHStartDate.getMonth() - 1);
	const [histStartDate, setHistStartDate] = useState(tempHStartDate);	

	var tempHEndDate = new Date(currEndDate.getTime());
	tempHEndDate.setMonth(tempHEndDate.getMonth() - 1);
	if(tempHEndDate.getMonth() != tempHStartDate.getMonth()) {
		tempHEndDate = new Date(tempHStartDate.getTime());
		tempHEndDate.setMonth(tempHEndDate.getMonth() + 1);
		tempHEndDate.setDate(0);
	}
	const [histEndDate, setHistEndDate] = useState(tempHEndDate);

	const histDate = {
		start : histStartDate,
		end   : histEndDate,
		startPlace: "From",
		endPlace: "To",
		class : "hist-dates"
	};
	
	const currDate = {
		start : currStartDate,
		end   : currEndDate,
		startPlace: "From",
		endPlace: "To",
		class : "curr-dates"
	};

	
	const histDateChanges = (...dates) => {
		ReactDOM.unstable_batchedUpdates(() => {
			setHistStartDate(dates[0]);
			setHistEndDate(typeof dates[1] !== 'undefined' && dates[1] ? dates[1] : histEndDate);
		});
	};
	const currDateChanges = (...dates) => {

		ReactDOM.unstable_batchedUpdates(() => {

			setCurrStartDate(dates[0]);
			setCurrEndDate(typeof dates[1] !== 'undefined' && dates[1] ? dates[1] : currEndDate);

			var tempS = new Date(dates[0].getTime());
			tempS.setMonth(tempS.getMonth() - 1);

			var tempE = new Date(typeof dates[1] !== 'undefined' && dates[1] ? dates[1] : currEndDate);
			tempE.setMonth(tempE.getMonth() - 1);

			setHistStartDate(tempS);
			setHistEndDate(tempE);

		});
	};
    return(
        <>
        <div className="gray-box pl-0 pr-0 pb-0 mso-box">
                <div className="container-fluid">
                    <div className="gray-box-block custom-form">
                        <div className="d-flex align-items-center m-title-flex">
                            <div>
                                <div className="main-heading">WEEKLY DIGITAL MARKETING STATS</div>
                                <div className="sub-heading">Instructional copy here lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                            </div>
                            <div className="ml-auto">
                                <button className="green-btn">Generate Report</button>
                            </div>
                        </div>
                        <div className="gray-box-block black-box-border pd-30 mt-50">
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="custom-label text-uppercase">Hide Row</div>
                                    <div className="dropdown show custom-white-dropdown">
                                        <a className="btn btn-secondary dropdown-toggle mxw-126" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select Row
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            {generateHideOptions()}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="custom-label text-uppercase">Current Period</div>
                                    <RangeDatePicker
                                        startDate={histStartDate}
                                        endDate={histEndDate}
                                        onChange={histDateChanges}
                                        dateFormat="D MMM YYYY"
                                        monthFormat="MMM YYYY"
                                        startDatePlaceholder={histDate.startPlace}
                                        endDatePlaceholder={histDate.endPlace}
                                        disabled={false}
                                        className={histDate.class}
                                        startWeekDay="monday"
                                        highlightToday={true}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <div className="custom-label text-uppercase">Previous Period</div>
                                    <RangeDatePicker
                                        startDate={currStartDate}
                                        endDate={currEndDate}
                                        onChange={currDateChanges}
                                        dateFormat="D MMM YYYY"
                                        monthFormat="MMM YYYY"
                                        startDatePlaceholder={currDate.startPlace}
                                        endDatePlaceholder={currDate.endPlace}
                                        disabled={false}
                                        className={currDate.class}
                                        startWeekDay="monday"
                                        highlightToday={true}
                                    />
                                </div>
                            </div>
                            <div className="cs-table-block wdm-table mt-40">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Metric</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col" className="text-start">Change</th>
                                            <th scope="col" className="blank-col"></th>
                                            <th scope="col">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {statData && statData.map((s, i) => {
                                        return (
                                            <tr id={"metRow-"+(i+1)} key={"metRow-"+(i+1)}>
                                                <td>{s.name}</td>
                                                <td className="count-value">{s.curr_qty}</td>
                                                <td><span className={s.change >= 0 ? 'white-text wdm-progress' : 'red-text wdm-progress'} >{Math.abs(s.change)}% 
                                                <img src={s.change >= 0 ? greenUp : redDown} /></span></td>
                                                <td className="blank-col"></td>
                                                <td className="count-value">{s.old_qty}</td>
                                            </tr>
                                        )
                                    })}
                                        
                                        <tr className="f-total">
                                            <td>
                                                <div className="dropdown show custom-white-dropdown">
                                                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Leads
                                                    </a>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                        <a className="dropdown-item" href="#">Action</a>
                                                        <a className="dropdown-item" href="#">Another action</a>
                                                        <a className="dropdown-item" href="#">Something else here</a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-inline-flex">
                                                    <input type="text" className="form-control w-80 text-center" value="110"/>
                                                </div>
                                            </td>
                                            <td><span className="white-text wdm-progress">10% <img src={greenUp}/></span></td>
                                            <td className="blank-col"></td>
                                            <td className="count-value">
                                                <div className="d-inline-flex">
                                                    <input type="text" className="form-control w-80 text-center" value="110"/>
                                                    <button className="green-transparent-btn ml-20">Save</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="text-center mt-35">
                                    <a href="#" className="transparent-btn"><img src={greenAdd}/> Add Another Row</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}