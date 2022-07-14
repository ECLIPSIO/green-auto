import $ from 'jquery';
import dateIcon from '../img/ico-date.svg';
import closeIcon from '../img/ico-close.svg';
import greenUp from '../img/green-arrow-up.svg';
import greenAdd from '../img/green_add_circle.svg';
import redDown from '../img/red-arrow-down.png';
import { useState, useContext, useRef, useEffect } from 'react';
import {RangeDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import axios from 'axios'; 
import Loading from '../_parts/Loading';
import Moment from 'moment';

import {UserContext} from '../context/UserContext';

import React from "react";
import ReactDOM from "react-dom";
import ReactToPdfMatt from '../tools/reacttopdf'

window.jQuery = $;
window.$ = $;
global.jQuery = $;
export default function WeekStats({statData, setStatData}){
    const {user} = useContext(UserContext); 

	Moment.locale('en');

	const numberFormatter = (value, currency = false) => {
		var num = value ? value.toString().replace(/[^0-9\.]+/g,"") : 0;

		if(currency && num >= 10) num = Math.round(num);
		
		var sign = num>= 0 ? "" : "-";
		var str = num.toString().replace("$", ""), parts = false, output = [], i = 1, formatted = null;
		if(str.indexOf(".") > 0) {
			parts = str.split(".");
			str = parts[0];
		}
		str = str.split("").reverse();
		for(var j = 0, len = str.length; j < len; j++) {
			if(str[j] != ",") {
				output.push(str[j]);
				if(i%3 == 0 && j < (len - 1)) {
					output.push(",");
				}
				i++;
			}
		}
		formatted = output.reverse().join("");
		return((currency ? "$" : "") + sign + formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
	}

    let [addNew, setAddNew] = useState(false);
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

        statData.map((stat, i) => {
            elem.push(<div className="dropdown-item">
                <div className="custom-checkbox">
                    <input className="styled-checkbox" id={"metCheckbox-"+i} type="checkbox" value={i} onChange={(e) => {hideShowRow(e.target.value)}}/>
                    <label htmlFor={"metCheckbox-"+i}>{stat['name']}</label>
                </div>
            </div>);
        });
        return elem;
    }
	
	const protocol = window.location.protocol;
	const data_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_combined.php";

	const buildUrl = (url) => {
		console.table({
			histS:histStartDate,
			histE:histEndDate,
			currS:currStartDate,
			currE:currEndDate
		});

		//const queryParams = new URLSearchParams(window.location.search);

		var build_url = url + "?hist_begin_date=" + Math.round(histStartDate.getTime()/1000) + "&hist_end_date=" + Math.round(histEndDate.getTime()/1000) + "&begin_date=" + Math.round(currStartDate.getTime()/1000) +"&end_date=" + Math.round(currEndDate.getTime()/1000) + "&query_count=999" + "&dealership=" + user.dealership_id;

		console.log(build_url);

		return build_url;
	}

    var tempStartDate = new Date(); 

	// set to Monday of this week
	tempStartDate.setDate(tempStartDate.getDate() - (tempStartDate.getDay() + 6) % 7);
	// set to previous Monday
	tempStartDate.setDate(tempStartDate.getDate() - 7);
	tempStartDate.setHours(0,0,0,0);
	const [currStartDate, setCurrStartDate] = useState(tempStartDate);

	var tempEndDate = new Date(tempStartDate.getTime());
	tempEndDate.setDate(tempEndDate.getDate() + 6);
	const [currEndDate, setCurrEndDate] = useState(tempEndDate);

	var tempHStartDate = new Date(tempStartDate.getTime());
	tempHStartDate.setDate(tempStartDate.getDate() - 7);
	const [histStartDate, setHistStartDate] = useState(tempHStartDate);	

	var tempHEndDate = new Date(tempEndDate.getTime());
	tempHEndDate.setDate(tempHEndDate.getDate() - 7);
	const [histEndDate, setHistEndDate] = useState(tempHEndDate);

    const [data, setData] = useState({
		name: 'Leads',
		curr_qty: 110,
		change: 10,
		old_qty: 110,
	});
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
			tempS.setDate(tempS.getDate() - 7);

			var tempE = new Date(typeof dates[1] !== 'undefined' && dates[1] ? dates[1] : currEndDate);
			tempE.setDate(tempE.getDate() - 7);

			setHistStartDate(tempS);
			setHistEndDate(tempE);

		});
	};

	const prevCurrStart = useRef(0);
	const prevCurrEnd = useRef(0);
	const prevHistStart = useRef(0);
	const prevHistEnd = useRef(0);
	const prevDealership = useRef(0);

	const isGoogleLoading = useRef(false);
	const [googleData, setGoogleData] = useState(null);
	const[loader, showLoader] = useState(false);

	const usePrevious = (value, initialValue) => {
		const ref = useRef(initialValue);
		useEffect(() => {
		  ref.current = value;
		});
		return ref.current;
	};

	const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
		const previousDeps = usePrevious(dependencies, []);
	  
		const changedDeps = dependencies.reduce((accum, dependency, index) => {
		  if (dependency !== previousDeps[index]) {
			const keyName = dependencyNames[index] || index;
			return {
			  ...accum,
			  [keyName]: {
				before: previousDeps[index],
				after: dependency
			  }
			};
		  }
	  
		  return accum;
		}, {});
	  
		if (Object.keys(changedDeps).length) {
		  console.log('[use-effect-debugger] ', changedDeps);
		}
	  
		useEffect(effectHook, dependencies);
	};

	useEffectDebugger(() => {

		console.log("HomeTab.js useEffect");

		if(user && (user.dealership_id != prevDealership.current || (currStartDate && currEndDate && histStartDate && histEndDate && !(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()) && currStartDate.getTime() <= currEndDate.getTime() && histStartDate.getTime() <= histEndDate.getTime()))) {

			isGoogleLoading.current = true;
			setGoogleData(null);
            showLoader(true);
			console.log("getting data");

			prevCurrStart.current = currStartDate.getTime();
			prevCurrEnd.current = currEndDate.getTime();
			prevHistStart.current = histStartDate.getTime();
			prevHistEnd.current = histEndDate.getTime();
			prevDealership.current = user.dealership_id;

			axios.get(buildUrl(data_url)).then(function (response) {
				var gas_data = response.data;
				console.log("got analytics data");
				console.log(gas_data);
				if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;

				isGoogleLoading.current = false;
				setGoogleData(gas_data);
                showLoader(false);

				//if(!(gas_data && gas_data.analytics_data.has_history)) alert("No data for historical period");

				setStatData(gas_data);

			});
		} else 
			console.log("all dates not set, or dates not changed");
	}, [currStartDate.getTime(), currEndDate.getTime(), histStartDate.getTime(), histEndDate.getTime(), user.dealership_id]);

    const PDFref = React.createRef();

    const PDFoptions = {
        orientation: 'portrait'
    };

    return(
        <>
		<Loading isOpen={loader} />
        <div className="gray-box pl-0 pr-0 pb-0 mso-box">
                <div className="container-fluid">
                    <div className="gray-box-block custom-form">
                        <div className="d-flex align-items-center m-title-flex">
                            <div>
                                <div className="main-heading">WEEKLY DIGITAL MARKETING STATS</div>
                                <div className="sub-heading">Instructional copy here lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                            </div>
                            <div className="ml-auto">
                                <ReactToPdfMatt targetRef={PDFref} filename={user.dealership + ".pdf"} options={PDFoptions} x={0} y={0} scale={1} backgroundColor={"#23262b"} currentDealership={user.dealership} currDateString={Moment(currStartDate).format('MMMM D, YYYY,') + " to " + Moment(currEndDate).format('MMMM D, YYYY,')} histDateString={Moment(histStartDate).format('MMMM D, YYYY,') + " to " + Moment(histEndDate).format('MMMM D, YYYY,')}>
                                    {({toPdf, PDFref}) =>  (
                                        <button className="green-btn" onClick={toPdf}>Generate Report</button>
                                    )}
                                </ReactToPdfMatt>
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
                                            {statData && generateHideOptions()}
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
                            <div className="cs-table-block wdm-table mt-40" ref={PDFref}>
                                <table className="table table-striped pdf-background">
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
                                            <tr id={"metRow-"+i} key={"metRow-"+i}>
                                                <td>{s.name}</td>
                                                <td className="count-value">{numberFormatter(s.curr_qty,s.is_currency !== undefined)}</td>
                                                <td><span className={s.change >= 0 ? 'white-text wdm-progress' : 'red-text wdm-progress'} >{numberFormatter(Math.round(s.change * 100))}% 
                                                <img src={s.change >= 0 ? greenUp : redDown} /></span></td>
                                                <td className="blank-col"></td>
                                                <td className="count-value">{numberFormatter(s.old_qty,s.is_currency !== undefined)}</td>
                                            </tr>
                                        )
                                    })}
                                        
                                        {addNew && (
											<tr className='f-total'>
												<td>
													<div className='dropdown show custom-white-dropdown'>
														<a
															className='btn btn-secondary dropdown-toggle'
															href='#'
															role='button'
															id='dropdownMenuLink'
															data-toggle='dropdown'
															aria-haspopup='true'
															aria-expanded='false'
														>
															{data.name}
														</a>
														<div
															className='dropdown-menu'
															aria-labelledby='dropdownMenuLink'
														>
															<a
																className='dropdown-item'
																href='#'
																onClick={e => {
																	e.preventDefault();
																	setData(
																		prevState => {
																			prevState.name =
																				'Leads';
																			return {
																				...prevState,
																			};
																		}
																	);
																}}
															>
																Leads
															</a>
															<a
																className='dropdown-item'
																href='#'
																onClick={e => {
																	e.preventDefault();
																	setData(
																		prevState => {
																			prevState.name =
																				'Action';
																			return {
																				...prevState,
																			};
																		}
																	);
																}}
															>
																Action
															</a>
															<a
																className='dropdown-item'
																href='#'
																onClick={e => {
																	e.preventDefault();
																	setData(
																		prevState => {
																			prevState.name =
																				'Another action';
																			return {
																				...prevState,
																			};
																		}
																	);
																}}
															>
																Another action
															</a>
															<a
																className='dropdown-item'
																href='#'
																onClick={e => {
																	e.preventDefault();
																	setData(
																		prevState => {
																			prevState.name =
																				'Something else here';
																			return {
																				...prevState,
																			};
																		}
																	);
																}}
															>
																Something else
																here
															</a>
														</div>
													</div>
												</td>
												<td className='text-center'>
													<div className='d-inline-flex'>
														<input
															type='text'
															className='form-control w-80 text-center'
															value={
																data.curr_qty
															}
															onChange={e => {
																setData(
																	prevState => {
																		prevState.curr_qty = e.target.value;
																		prevState.change = prevState.old_qty > 0 ? (prevState.curr_qty - prevState.old_qty) / prevState.old_qty : 0;
																		return {
																			...prevState,
																		};
																	}
																);
															}}
														/>
													</div>
												</td>
												<td>
													<span className='white-text wdm-progress'>
														10%{' '}
														<img src={greenUp} />
													</span>
												</td>
												<td className='blank-col'></td>
												<td className='count-value'>
													<div className='d-inline-flex align-items-center'>
														<input
															type='text'
															className='form-control w-80 text-center'
															value={data.old_qty}
															onChange={e => {
																setData(
																	prevState => {
																		prevState.old_qty = e.target.value;
																		prevState.change = prevState.old_qty > 0 ? (prevState.curr_qty - prevState.old_qty) / prevState.old_qty : 0;
																		return {
																			...prevState,
																		};
																	}
																);
															}}
														/>
														<button
															className='green-transparent-btn ml-20'
															style={{
																cursor: 'pointer',
															}}
															onClick={() => {
																setStatData(
																	prevState => [
																		...prevState,
																		{
																			...data,
																		},
																	]
																);
																setData({
																	name: 'Leads',
																	curr_qty: 110,
																	change: 10,
																	old_qty: 110,
																});
																setAddNew(
																	false
																);
															}}
														>
															Save
														</button>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															xmlnsXlink='http://www.w3.org/1999/xlink'
															width='16px'
															height='16px'
															viewBox='0 0 16 16'
															version='1.1'
															style={{
																cursor: 'pointer',
															}}
															onClick={() =>
																setAddNew(false)
															}
															className='ml-3'
														>
															<title>
																AEC7A704-2258-4B84-91C4-20654970657E
															</title>
															<g
																id='Page-1'
																stroke='none'
																strokeWidth={1}
																fill='none'
																fillRule='evenodd'
															>
																<g
																	id='DT-Gas-Tab-4'
																	transform='translate(-1232.000000, -624.000000)'
																	fill='#FFFFFF'
																	fillRule='nonzero'
																>
																	<g
																		id='Group-4-Copy-2'
																		transform='translate(119.000000, 580.000000)'
																	>
																		<path
																			d='M1128.01863,60 C1128.29193,60 1128.52381,59.9047619 1128.71429,59.7142857 C1128.90476,59.5238095 1129,59.2919255 1129,59.0186335 C1129,58.7453416 1128.90062,58.5175983 1128.70186,58.3354037 L1122.3913,52 L1128.70186,45.6645963 C1128.90062,45.4824017 1129,45.2546584 1129,44.9813665 C1129,44.7080745 1128.90476,44.4761905 1128.71429,44.2857143 C1128.52381,44.0952381 1128.29193,44 1128.01863,44 C1127.74534,44 1127.5176,44.0993789 1127.3354,44.2981366 L1121,50.6086957 L1114.6646,44.2981366 C1114.4824,44.0993789 1114.25466,44 1113.98137,44 C1113.70807,44 1113.47619,44.0952381 1113.28571,44.2857143 C1113.09524,44.4761905 1113,44.7080745 1113,44.9813665 C1113,45.2546584 1113.09938,45.4824017 1113.29814,45.6645963 L1119.6087,52 L1113.29814,58.3354037 C1113.09938,58.5175983 1113,58.7453416 1113,59.0186335 C1113,59.2919255 1113.09524,59.5238095 1113.28571,59.7142857 C1113.47619,59.9047619 1113.70807,60 1113.98137,60 C1114.25466,60 1114.4824,59.9006211 1114.6646,59.7018634 L1121,53.3664596 L1127.3354,59.7018634 C1127.5176,59.9006211 1127.74534,60 1128.01863,60 Z'
																			id='icon-x'
																		/>
																	</g>
																</g>
															</g>
														</svg>
													</div>
												</td>
											</tr>
										)}

                                    </tbody>
                                </table>
                            </div>
                            <div className="text-center mt-35">
                                <a 
                                href="#" 
                                className="transparent-btn"
                                onClick={e => {
                                    e.preventDefault();
                                    setAddNew(true);
                                }}
                                >
                                    <img src={greenAdd}/> Add Another Row
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}