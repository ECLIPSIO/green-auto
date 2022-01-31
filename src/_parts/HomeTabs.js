import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios'; 
import infoIcon from '../img/ico-info.svg';

import BarChart from '../charts/BarChart';
import RaceChart from '../charts/RaceChart';
import {RangeDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
export default function HomeTabs(){
	  
	const numberFormatter = (value, currency = false) => {
		var num = value ? value.toString().replace(/[^0-9\.]+/g,"") : 0;
		
		var sign = value >= 0 ? "" : "-";
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

	const timeFormatter = (seconds, start = 14, length = 5) => {
		//minutes seconds 14,5  hours minutes seconds 11,8
		seconds = seconds ? seconds : 0;
		return new Date(seconds * 1000).toISOString().substr(start, length);
	}

	const getAnalyticsSection = (value,type = 'number') => {

		if(type == 'time') {
			return (<div className="m-value">{timeFormatter(value)}</div>);
		} else if(type == 'currency') {
			return (<div className="m-value">{numberFormatter(value,true)}</div>);
		} else if(type == 'percent') {
			return (<div className="m-value">{numberFormatter(value)}%</div>);
		}

		return (<div className="m-value">{numberFormatter(value)}</div >);
	}

	const getAnalyticsIndicator = (value,reverseColor = false) => {

		if(value >= 0) {
			return (<div className="p-value green"><div className="up-arrow"></div> {numberFormatter(value * 100)} %</div>);
		} 

		return (<div className="p-value red"><div className="down-arrow"></div> {numberFormatter(value * 100)} % </div>);
	}

	const todayDate = new Date();

	var tempDate = new Date();
	tempDate.setDate(todayDate.getDate() - 60);
	const [histStartDate, setHistStartDate] = useState(tempDate);

	var tempDate = new Date();
	tempDate.setDate(todayDate.getDate() - 30);
	const [histEndDate, setHistEndDate] = useState(tempDate);

	var tempDate = new Date();
	tempDate.setDate(todayDate.getDate() - 30);
	const [currStartDate, setCurrStartDate] = useState(tempDate);

	var tempDate = new Date();
	tempDate.setDate(todayDate.getDate() - 0);
	const [currEndDate, setCurrEndDate] = useState(tempDate);

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
	
	const histDateChanges = (...dates) =>{
		setHistStartDate(dates[0]);
		setHistEndDate(dates[1]);
	};
	const currDateChanges = (...dates) =>{
		setCurrStartDate(dates[0]);
		setCurrEndDate(dates[1]);
	};

	var gas_data;
	
	const url = 'http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com/bridge/analytics/gas.php';

	//const [searchParams, setSearchParams] = useSearchParams();

	const [isLoading, setLoading] = useState(true);
	const [analyticsData, setAnalyticsData] = useState();

	const buildUrl = () => {
		console.table({
			histS:histStartDate,
			histE:histEndDate,
			currS:currStartDate,
			currE:currEndDate
		});

		const queryParams = new URLSearchParams(window.location.search);

		var build_url = url + "?hist_begin_date=" + Math.round(histStartDate.getTime()/1000) + "&hist_end_date=" + Math.round(histEndDate.getTime()/1000) + "&begin_date=" + Math.round(currStartDate.getTime()/1000) +"&end_date=" + Math.round(currEndDate.getTime()/1000) + "&query_count=6" + "&dealership=" + queryParams.get('dealership');

		console.log(build_url);

		return build_url;
	}

	const prevCurrStart = useRef(0);
	const prevCurrEnd = useRef(0);
	const prevHistStart = useRef(0);
	const prevHistEnd = useRef(0);

	useEffect(() => {

		if(currStartDate && currEndDate && histStartDate && histEndDate && !(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()) && currStartDate.getTime() < currEndDate.getTime() && histStartDate.getTime() < histEndDate.getTime()) {

			setLoading(true);
			console.log("getting data");

			prevCurrStart.current = currStartDate.getTime();
			prevCurrEnd.current = currEndDate.getTime();
			prevHistStart.current = histStartDate.getTime();
			prevHistEnd.current = histEndDate.getTime();

			axios.get(buildUrl()).then(function (response) {
				gas_data = response.data;
				console.log("got data");
				console.log(gas_data);
				setAnalyticsData(gas_data);
				setLoading(false);
			});
		} else 
			console.log("all dates not set, or dates not changed");
	}, [currStartDate, currEndDate, histStartDate, histEndDate]);

    return(
        <>
        <div className="custom-tabs">
				<ul className="nav nav-tabs" id="myTab" role="tablist">
				  	<li className="nav-item">
				    	<a className="nav-link active" id="cs_1_tab" data-toggle="tab" href="#cs_1" role="tab" aria-controls="cs_1" aria-selected="true">Key Metrics</a>
				  	</li>
				  	<li className="nav-item">
				    	<a className="nav-link" id="cs_2_tab" data-toggle="tab" href="#cs_2" role="tab" aria-controls="cs_2" aria-selected="false">Section Two</a>
				  	</li>
				  	<li className="nav-item">
				    	<a className="nav-link" id="cs_3_tab" data-toggle="tab" href="#cs_3" role="tab" aria-controls="cs_3" aria-selected="false">Section Three</a>
				  	</li>
				</ul>
				<div className="tab-content" id="myTabContent">
				  	<div className="tab-pane fade show active" id="cs_1" role="tabpanel" aria-labelledby="cs_1_tab">
						<div className="gray-box pl-0 pr-0">
							<div className="container-fluid">
									<div className="row date-filter-block">
									<div className="col-md-5">
										<label className="custom-label text-uppercase">Historical</label>
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
										{/* <GDateRange target={histDate}/> */}
									</div>
									<div className="col-md-2"></div>
									<div className="col-md-5">
										<label className="custom-label text-uppercase">Current</label>
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
										{/* <GDateRange target={currDate}/> */}
									</div>
								</div>
								<div className="l-gray-box mt-40">
									<div className="d-flex">
										<div className="col">
											<div className="custom-label text-uppercase text-center">Current Spend</div>
											{analyticsData && analyticsData.adCost_breakdown.all_adCost ? getAnalyticsSection(analyticsData.adCost_breakdown.all_adCost,'currency') : ''}
											{analyticsData && analyticsData.adCost_diff ? getAnalyticsIndicator(analyticsData.adCost_diff) : '-'}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Website Hits</div>
											{analyticsData && analyticsData.channels.all['ga:sessions'] ? getAnalyticsSection(analyticsData.channels.all['ga:sessions']) : ''}
											{analyticsData && analyticsData.channels_diff.all['ga:sessions'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:sessions']) : '-'}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Time on Site</div>
											{analyticsData && analyticsData.channels.all['ga:sessions'] ? getAnalyticsSection(analyticsData.channels.all['ga:avgSessionDuration'],'time') : ''}
											{analyticsData && analyticsData.channels_diff.all['ga:avgSessionDuration'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:avgSessionDuration']) : '-'}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Pages / Session</div>
											{analyticsData && analyticsData.channels.all['ga:pageviewsPerSession'] ? getAnalyticsSection(analyticsData.channels.all['ga:pageviewsPerSession']) : ''}
											{analyticsData && analyticsData.channels_diff.all['ga:pageviewsPerSession'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:pageviewsPerSession']) : '-'}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Bounce Rate</div>
											{analyticsData && analyticsData.channels.all['ga:bounceRate'] ? getAnalyticsSection(analyticsData.channels.all['ga:bounceRate'],'percent') : ''}
											{analyticsData && analyticsData.channels_diff.all['ga:bounceRate'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:bounceRate']) : '-'}
										</div>
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="m-title text-uppercase">
                                        Website Hits by Source
                                        <span className="info-msg">
                                            <img className="ico_info" src={infoIcon} alt="info" />
                                            <div>
                                            </div>
                                        </span>
                                    </div>
									<div className="graph-block">
									{isLoading ? 'Loading' : <RaceChart graphData={analyticsData.race_chart}/>}
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">Leading Interceptions <span className="info-msg"><img className="ico_info" src={infoIcon} alt="info" /> <div></div></span></div>
										
									</div>
									<div className="cs-table-block">
										<table className="table table-striped">
										  	<thead>
											    <tr>
												    <th scope="col">Search Term</th>
												    <th scope="col">Web Hits Current</th>
												    <th scope="col">Web Hits Historic</th>
												    <th scope="col">Cost</th>
												    <th scope="col">Time on Site</th>
												    <th scope="col">Pages / Session</th>
												    <th scope="col">Bounce Rate</th>
											    </tr>
										  	</thead>
										  	<tbody>
												{analyticsData && analyticsData.top_queries && Object.keys(analyticsData.top_queries).map(function(index) {
														return <tr key={index}>
															<td>{index}</td>
															<td>{analyticsData.top_queries[index]["ga:sessions"]}</td>
															<td>{analyticsData.top_queries[index]["ga:sessions_hist"] ? analyticsData.top_queries[index]["ga:sessions_hist"] : "-"}</td>
															<td>{numberFormatter(analyticsData.top_queries[index]["cost"],true)}</td>
															<td>{timeFormatter(analyticsData.top_queries[index]["ga:avgSessionDuration"])}</td>
															<td>{numberFormatter(analyticsData.top_queries[index]["ga:pageviewsPerSession"])}</td>
															<td>{numberFormatter(analyticsData.top_queries[index]["ga:bounceRate"])}%</td>
														</tr>
													})
												}
										  	</tbody>
										</table>
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">Power Rankings <span className="info-msg"><img className="ico_info" src={infoIcon} alt="info" /> <div></div></span></div>
										<div className="ml-auto">
											<div className="d-flex align-items-center colors-label">
												<div>Current <span className="green-box"></span></div>
												<div className="ml-40">Historical <span className="red-box"></span></div>
											</div>
										</div>
									</div>									
									{isLoading ? 'Loading' : <BarChart graphData={analyticsData.bar_chart}/>}
								</div>
							</div>
						</div>
				  	</div>
				  	<div className="tab-pane fade" id="cs_2" role="tabpanel" aria-labelledby="cs_2_tab">
						<div className="gray-box">
							<div className="container-fluid"></div>
						</div>
				  	</div>
				  	<div className="tab-pane fade" id="cs_3" role="tabpanel" aria-labelledby="cs_3_tab">
						<div className="gray-box">
							<div className="container-fluid"></div>
						</div>
				  	</div>
				</div>
			</div>
        </>
    )
}