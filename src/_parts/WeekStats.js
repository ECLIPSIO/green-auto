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
export default function WeekStats({statData, setStatData}){
    const[metrics, setMetrics] = useState(0);
    let [addNew, setAddNew] = useState(false);
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
																		prevState.curr_qty =
																			e.target.value;
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
																		prevState.old_qty =
																			e.target.value;
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
            </div>
        </>
    )
}