import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios'; 
import infoIcon from '../img/ico-info.svg';

import BarChart from '../charts/BarChart';
import RaceChart from '../charts/RaceChart';
import Chart from 'react-apexcharts'
import {RangeDatePicker} from "react-google-flight-datepicker";
import ReactTooltip from 'react-tooltip';
import "react-google-flight-datepicker/dist/main.css";

import vehicles from '../data/vehicle.json';
import $ from 'jquery';
// import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';

import {useContext} from 'react'
import {UserContext} from '../context/UserContext';

import SeoTable from './SeoTable';
import ReferralTable from './ReferralTable';
import Gmb from '../components/Gmb';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
const OwlCarousel = require('react-owl-carousel');

export default function HomeTabs(){

	const {user} = useContext(UserContext); 
	  
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
			return (<div className="m-value">{numberFormatter(Math.round(value),true)}</div>);
		} else if(type == 'percent') {
			return (<div className="m-value">{numberFormatter(Math.round(value))}%</div>);
		}

		return (<div className="m-value">{numberFormatter(value)}</div >);
	}

	const getAnalyticsIndicator = (value,reverseColor = false) => {

		if(value >= 0) {
			return (<div className="p-value green"><div className="up-arrow"></div> {numberFormatter(Math.round(value * 100))} %</div>);
		} 

		return (<div className="p-value red"><div className="down-arrow"></div> {numberFormatter(Math.round(value * 100))} % </div>);
	}

	var tempDate = new Date();
	if(tempDate.getDate() >= 7) tempDate.setDate(1);
	else {
		tempDate.setMonth(tempDate.getMonth() - 1);
		tempDate.setDate(1);
	}
	tempDate.setHours(0,0,0,0);
	const [currStartDate, setCurrStartDate] = useState(tempDate);
	const [currSeoStartDate, setCurrSeoStartDate] = useState(tempDate);

	var tempDate = new Date();
	if(tempDate.getDate() < 7) tempDate.setDate(0);
	tempDate.setHours(0,0,0,0);
	const [currEndDate, setCurrEndDate] = useState(tempDate);
	const [currSeoEndDate, setCurrSeoEndDate] = useState(tempDate);

	var tempDate = new Date(currStartDate.getTime());
	tempDate.setMonth(tempDate.getMonth() - 1);
	const [histStartDate, setHistStartDate] = useState(tempDate);
	const [histSeoStartDate, setHistSeoStartDate] = useState(tempDate);

	var tempDate = new Date(currEndDate.getTime());
	tempDate.setMonth(tempDate.getMonth() - 1);
	if(tempDate.getMonth() != histStartDate.getMonth()) {
		tempDate = new Date(histStartDate.getTime());
		tempDate.setMonth(tempDate.getMonth() + 1);
		tempDate.setDate(0);
	}
	const [histEndDate, setHistEndDate] = useState(tempDate);
	const [histSeoEndDate, setHistSeoEndDate] = useState(tempDate);

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

	const histSeoDate = {
		start	: histSeoStartDate,
		end 	: histSeoEndDate,
		startPlace : 'From',
		endPlace : 'To',
		class	: 'seo-curr-dates' 
	};

	const currSeoDate = {
		start	: currSeoStartDate,
		end 	: currSeoEndDate,
		startPlace : 'From',
		endPlace : 'To',
		class	: 'seo-curr-dates' 
	};
	
	const histDateChanges = (...dates) =>{
		setHistStartDate(dates[0]);
		setHistEndDate(dates[1]);
	};
	const currDateChanges = (...dates) =>{
		setCurrStartDate(dates[0]);
		setCurrEndDate(dates[1]);
	};

	const histSeoDateChanges = (...dates) =>{
		setHistSeoStartDate(dates[0]);
		setHistSeoEndDate(dates[1]);
	};
	const currSeoDateChanges = (...dates) =>{
		setCurrSeoStartDate(dates[0]);
		setCurrSeoEndDate(dates[1]);
	};
	
	const protocol = window.location.protocol;
	const analytics_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_analytics.php";
	const search_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_search.php"; 
	const business_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_business.php"; 

	//const [searchParams, setSearchParams] = useSearchParams();

	const [isLoading, setLoading] = useState(true);
	const [isSEOLoading, setSEOLoading] = useState(true);
	const [isGMBLoading, setGMBLoading] = useState(true);
	const [analyticsData, setAnalyticsData] = useState();
	const [searchData, setSearchData] = useState();
	const [businessData, setBusinessData] = useState();

	const buildUrl = (url) => {
		console.table({
			histS:histStartDate,
			histE:histEndDate,
			currS:currStartDate,
			currE:currEndDate
		});

		const queryParams = new URLSearchParams(window.location.search);

		var build_url = url + "?hist_begin_date=" + Math.round(histStartDate.getTime()/1000) + "&hist_end_date=" + Math.round(histEndDate.getTime()/1000) + "&begin_date=" + Math.round(currStartDate.getTime()/1000) +"&end_date=" + Math.round(currEndDate.getTime()/1000) + "&query_count=6" + "&dealership=" + user.dealership_id;

		console.log(build_url);

		return build_url;
	}

	const resizeWindow = () => {
		setTimeout(()=>{window.dispatchEvent(new Event('resize')); console.log('Resize Triggered');}, 1000);
		
	}

	const prevCurrStart = useRef(0);
	const prevCurrEnd = useRef(0);
	const prevHistStart = useRef(0);
	const prevHistEnd = useRef(0);
	const prevDealership = useRef(0);

	useEffect(() => {

		console.log("HomeTab.js useEffect");

		if(user && (user.dealership_id != prevDealership || (currStartDate && currEndDate && histStartDate && histEndDate && !(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()) && currStartDate.getTime() <= currEndDate.getTime() && histStartDate.getTime() <= histEndDate.getTime()))) {

			setLoading(true);
			setSEOLoading(true);
			setGMBLoading(true);
			console.log("getting data");

			prevCurrStart.current = currStartDate.getTime();
			prevCurrEnd.current = currEndDate.getTime();
			prevHistStart.current = histStartDate.getTime();
			prevHistEnd.current = histEndDate.getTime();
			prevDealership.current = user.dealership_id;

			axios.get(buildUrl(analytics_url)).then(function (response) {
				var gas_data = response.data;
				console.log("got analytics data");
				console.log(gas_data);
				if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;
				setAnalyticsData(gas_data);
				setLoading(false);

				if(!(gas_data && gas_data.has_history)) alert("No data for current historical period");

				

				axios.get(buildUrl(search_url)).then(function (response) {
					var gas_data = response.data;
					console.log("got search data");
					console.log(gas_data);
					if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;
					setSearchData(gas_data);
					setSEOLoading(false);

					if(!(gas_data && gas_data.has_history)) alert("No seo/ppc data for current historical period");
				});

				axios.get(buildUrl(business_url)).then(function (response) {
					var gas_data = response.data;
					console.log("got business data");
					console.log(gas_data);
					if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;
					setBusinessData(gas_data);
					setGMBLoading(false);

					if(!(gas_data && gas_data.has_history)) alert("No GMB data for current historical period");

				});
			});
		} else 
			console.log("all dates not set, or dates not changed");
	}, [currStartDate, currEndDate, histStartDate, histEndDate, user.dealership_id]);

    return(
        <>
        <div className="custom-tabs">
				<ul className="nav nav-tabs" id="myTab" role="tablist">
				  	<li className="nav-item">
				    	<a className="nav-link active" id="cs_1_tab" data-toggle="tab" href="#cs_1" role="tab" aria-controls="cs_1" aria-selected="true">Key Metrics</a>
				  	</li>
				  	<li className="nav-item">
				    	<a className="nav-link" id="cs_2_tab" data-toggle="tab" href="#cs_2" role="tab" aria-controls="cs_2" aria-selected="false">SEO / PPC</a>
				  	</li>
				  	<li className="nav-item">
				    	<a className="nav-link" onClick={resizeWindow} id="cs_3_tab" data-toggle="tab" href="#cs_3" role="tab" aria-controls="cs_3" aria-selected="false">GMB</a>
				  	</li>
				</ul>
				<div className="tab-content" id="myTabContent">
				  	<div className="tab-pane fade show active" id="cs_1" role="tabpanel" aria-labelledby="cs_1_tab">
						<div className="gray-box px-0">
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
											{analyticsData && analyticsData.adCost_breakdown && analyticsData.adCost_breakdown.all_adCost ? getAnalyticsSection(analyticsData.adCost_breakdown.all_adCost,'currency') : ''}
											{analyticsData && analyticsData.adCost_diff ? getAnalyticsIndicator(analyticsData.adCost_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Website Hits</div>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:sessions'] ? getAnalyticsSection(analyticsData.channels.all['ga:sessions']) : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:sessions'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:sessions']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Time on Site</div>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:sessions'] ? getAnalyticsSection(analyticsData.channels.all['ga:avgSessionDuration'],'time') : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:avgSessionDuration'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:avgSessionDuration']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Pages / Session</div>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:pageviewsPerSession'] ? getAnalyticsSection(analyticsData.channels.all['ga:pageviewsPerSession']) : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:pageviewsPerSession'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:pageviewsPerSession']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Bounce Rate</div>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:bounceRate'] ? getAnalyticsSection(analyticsData.channels.all['ga:bounceRate'] * 100,'percent') : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:bounceRate'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:bounceRate']) : ''}
										</div>
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="m-title text-uppercase">
                                        Website Hits by Source
                                        <span className="info-msg">
                                            <img className="ico_info" src={infoIcon} alt="info" data-tip="Hits By Source" data-for="web-hits"/>
											<ReactTooltip id='web-hits' place='top' type='light' effect='solid'></ReactTooltip>
                                            <div>
                                            </div>
                                        </span>
                                    </div>
									<div className="graph-block">
									{isLoading || analyticsData === null ? 'Loading' : <RaceChart graphData={analyticsData.race_chart}/>}
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Leading Interceptions 
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip='Leading Interceptions' data-for='lead-int'/>
												<ReactTooltip id='lead-int' type='light' place='top' effect='solid'></ReactTooltip>
											</span>
										</div>
										
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
															<td>{numberFormatter(Math.round(analyticsData.top_queries[index]["cost"]),true)}</td>
															<td>{timeFormatter(analyticsData.top_queries[index]["ga:avgSessionDuration"])}</td>
															<td>{numberFormatter(analyticsData.top_queries[index]["ga:pageviewsPerSession"])}</td>
															<td>{numberFormatter(Math.round(analyticsData.top_queries[index]["ga:bounceRate"] * 100))}%</td>
														</tr>
													})
												}
										  	</tbody>
										</table>
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Power Rankings 
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip='Power Rankings' data-for='pw-rank'/>
												<ReactTooltip id='pw-rank' type='light' place='top' effect='solid'></ReactTooltip>
											</span>
										</div>
										<div className="ml-auto">
											<div className="d-flex align-items-center colors-label">
												<div>Current <span className="green-box"></span></div>
												<div className="ml-40">Historical <span className="red-box"></span></div>
											</div>
										</div>
									</div>									
									{isLoading || analyticsData === null ? 'Loading' : <BarChart graphData={analyticsData.bar_chart}/>}
								</div>
							</div>
						</div>
				  	</div>
				  	<div className="tab-pane fade" id="cs_2" role="tabpanel" aria-labelledby="cs_2_tab">
						<div className="gray-box px-0">
							<div className="container-fluid">
								{/* Date Range Block */}
								<div className="row date-filter-block">
									<div className="col-md-5">
										<label className="custom-label text-uppercase">Historical</label>
										<RangeDatePicker
											startDate={histSeoStartDate}
											endDate={histSeoEndDate}
											onChange={histSeoDateChanges}
											dateFormat="D MMM YYYY"
											monthFormat="MMM YYYY"
											startDatePlaceholder={histSeoDate.startPlace}
											endDatePlaceholder={histSeoDate.endPlace}
											disabled={false}
											className={histSeoDate.class}
											startWeekDay="monday"
											highlightToday={true}
										/>
									</div>
									<div className="col-md-2"></div>
									<div className="col-md-5">
										<label className="custom-label text-uppercase">Current</label>
										<RangeDatePicker
											startDate={currSeoStartDate}
											endDate={currSeoEndDate}
											onChange={currDateChanges}
											dateFormat="D MMM YYYY"
											monthFormat="MMM YYYY"
											startDatePlaceholder={currSeoDate.startPlace}
											endDatePlaceholder={currSeoDate.endPlace}
											disabled={false}
											className={currSeoDate.class}
											startWeekDay="monday"
											highlightToday={true}
										/>
									</div>
								</div>

								{/* Data Slide Block */}
								<div className="l-gray-box mt-40">
									{/* <div className=""> */}
									<OwlCarousel className="dash-card-slider owl-carousel" items={5} slideBy={1} nav>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Avg Search Position</div>
											{searchData && searchData.search_data[0] && searchData.search_data[0].position ? getAnalyticsSection(searchData.search_data[0].position) : ''}
											{searchData && searchData.search_position_diff ? getAnalyticsIndicator(searchData.search_position_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Mobile Device Usage</div>
											{analyticsData && analyticsData.mobile_usage ? getAnalyticsSection(analyticsData.mobile_usage,'percent') : ''}
											{analyticsData && analyticsData.mobile_usage_diff ? getAnalyticsIndicator(analyticsData.mobile_usage_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Conversion Rate</div>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['conversion_rate'] ? getAnalyticsSection(analyticsData.channels.all['conversion_rate'] * 100,'percent') : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['conversion_rate'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['conversion_rate']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Phone Calls from Ads</div>
											{analyticsData && analyticsData.total_phone_calls ? getAnalyticsSection(analyticsData.total_phone_calls) : ''}
											{analyticsData && analyticsData.phone_calls_diff ? getAnalyticsIndicator(analyticsData.phone_calls_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">Engagement Rate</div>
											{analyticsData && analyticsData.engagement_rate ? getAnalyticsSection(analyticsData.engagement_rate * 100,'percent') : ''}
											{analyticsData && analyticsData.engagement_rate_diff ? getAnalyticsIndicator(analyticsData.engagement_rate_diff) : ''}
										</div>
									</OwlCarousel>
									{/* </div> */}
								</div>
											
								{/* Seo Report */}
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											SEO Report 
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip="SEO Report" data-for="seo-rep"/>
												<ReactTooltip id='seo-rep' place='top' type='light' effect='solid'></ReactTooltip>
											</span>
										</div>
									</div>
									{!isSEOLoading && searchData && searchData.search_data_by_query && <SeoTable seoData={searchData.search_data_by_query}/>}
								</div>

								{/* Vehicles Block */}
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Top 5 Vehicle Detail Page Views
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip="Top 5 Vehicle" data-for="top-vs"/>
												<ReactTooltip id='top-vs' place='top' type='light' effect='solid'></ReactTooltip>
											</span>
										</div>
									</div>
									<div className="d-flex vehicle-block-flex">
										{analyticsData && analyticsData.vdp_views && Object.keys(analyticsData.vdp_views).map(function(index) { 
											var vehicle = analyticsData.vdp_views[index];
											return	<div className="vehicle-block" key={index}>
													<div className="vehicle-box">
														<div className="vehicle-top">
															<img src={vehicle.primary_image} />
														</div>
														<div className="vehicle-bottom">
															<div className="vehicle-title">{vehicle.vehicle_name}</div>
															<div className="vb-flex d-flex">
																<div className="w-50">
																	<div className="vb-label">Current</div>
																	<div className="vb-label-count">{vehicle['ga:pageViews']}</div>
																</div>
																<div className="w-50 vb-brder-l">
																	<div className="vb-label">Historical</div>
																	<div className="vb-label-count">{vehicle['hist_ga:pageViews']}</div>
																</div>
															</div>
															{getAnalyticsIndicator(vehicle['ga:pageViews_diff'])}
														</div>
													</div>
												</div>
											})
										}
									</div>
								</div>

								{/* Traffic Block */}
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Referral Traffic
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip="Referral Traffic" data-for="ref-tf"/>
												<ReactTooltip id='ref-tf' place='top' type='light' effect='solid'></ReactTooltip>
											</span>
										</div>
									</div>
									{analyticsData && analyticsData.sources && <ReferralTable referralData={analyticsData.sources}/>}
								</div>
							</div>
						</div>
				  	</div>
				  	<div className="tab-pane fade" id="cs_3" role="tabpanel" aria-labelledby="cs_3_tab">
					  	{!isGMBLoading && businessData && <Gmb businessData={businessData}/>}
				  	</div>
				</div>
			</div>
        </>
    )
}