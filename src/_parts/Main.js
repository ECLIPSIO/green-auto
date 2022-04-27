import React, {useEffect, useState, useRef, useContext} from 'react';
import axios from 'axios'; 
import infoIcon from '../img/ico-info.svg';

import BarChart from '../charts/BarChart';
import RaceChart from '../charts/RaceChart';
import Chart from 'react-apexcharts'
import {RangeDatePicker} from "react-google-flight-datepicker";
import ReactTooltip from 'react-tooltip';
import "react-google-flight-datepicker/dist/main.css";

import Loading from '../_parts/Loading';
// import vehicles from '../data/vehicle.json';
import $ from 'jquery';
// import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';

import {UserContext} from '../context/UserContext';

import MoreTable from './MoreTable';
import Gmb from '../components/Gmb';
import Review from '../components/Review';
import ReviewForm from '../components/ReviewForm';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
const OwlCarousel = require('react-owl-carousel');

export default function Main(){

	const {user} = useContext(UserContext); 
	const[loader, showLoader] = useState(false);
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
		} else if(type == 'currency_precise') {
			return (<div className="m-value">{numberFormatter(Math.round(value*100)/100,true)}</div>);
		} else if(type == 'percent') {
			return (<div className="m-value">{numberFormatter(Math.round(value))}%</div>);
		} else if(type == 'percent_precise') {
			return (<div className="m-value">{numberFormatter(Math.round(value*100)/100)}%</div>);
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

	var tempDate = new Date();
	if(tempDate.getDate() < 7) tempDate.setDate(0);
	tempDate.setHours(0,0,0,0);
	const [currEndDate, setCurrEndDate] = useState(tempDate);

	var tempDate = new Date(currStartDate.getTime());
	tempDate.setMonth(tempDate.getMonth() - 1);
	const [histStartDate, setHistStartDate] = useState(tempDate);

	var tempDate = new Date(currEndDate.getTime());
	tempDate.setMonth(tempDate.getMonth() - 1);
	if(tempDate.getMonth() != histStartDate.getMonth()) {
		tempDate = new Date(histStartDate.getTime());
		tempDate.setMonth(tempDate.getMonth() + 1);
		tempDate.setDate(0);
	}
	const [histEndDate, setHistEndDate] = useState(tempDate);

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
	
	const protocol = window.location.protocol;
	const analytics_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_analytics.php";
	const search_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_search.php"; 
	const ads_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_goals.php"; 
	const business_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/google_business.php"; 

	//const [searchParams, setSearchParams] = useSearchParams();

	//const [isLoading, setLoading] = useState(true);
	//const [isSEOLoading, setSEOLoading] = useState(true);
	//const [isGMBLoading, setGMBLoading] = useState(true);
	const isAnalyticsLoading = useRef(false);
	const isSEOLoading = useRef(false);
	const isGMBLoading = useRef(false);
	const isAdsLoading = useRef(false);
	const startChart = useRef(false);
	const [analyticsData, setAnalyticsData] = useState(null);
	const [searchData, setSearchData] = useState(null);
	const [adsData, setAdsData] = useState(null);
	const [businessData, setBusinessData] = useState(null);

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

	const resizeWindow = () => {
		setTimeout(()=>{window.dispatchEvent(new Event('resize'));}, 1000);
		
	}

	const prevCurrStart = useRef(0);
	const prevCurrEnd = useRef(0);
	const prevHistStart = useRef(0);
	const prevHistEnd = useRef(0);
	const prevDealership = useRef(0);

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
		/*console.table({
			histS:histStartDate.getTime(),
			histSPrev:prevHistStart.current,
			histSComp:prevHistStart.current == histStartDate.getTime(),
			histE:histEndDate.getTime(),
			histEPrev:prevHistEnd.current,
			histEComp:prevHistEnd.current == histEndDate.getTime(),
			currS:currStartDate.getTime(),
			currSPrev:prevCurrStart.current,
			currSComp:prevCurrStart.current == currStartDate.getTime(),
			currE:currEndDate.getTime(),
			currEPrev:prevCurrEnd.current,
			currEComp:prevCurrEnd.current == currEndDate.getTime(),
			bool1:user,
			bool2:user.dealership_id != prevDealership.current,
			bool3:currStartDate && currEndDate && histStartDate && histEndDate,
			bool4:!(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()),
			bool4n:(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()),
			bool5: currStartDate.getTime() <= currEndDate.getTime(),
			bool6:histStartDate.getTime() <= histEndDate.getTime(),
			bool7:user && (user.dealership_id != prevDealership.current || (currStartDate && currEndDate && histStartDate && histEndDate && !(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()) && currStartDate.getTime() <= currEndDate.getTime() && histStartDate.getTime() <= histEndDate.getTime()))
		});*/

		if(user && (user.dealership_id != prevDealership.current || (currStartDate && currEndDate && histStartDate && histEndDate && !(prevCurrStart.current == currStartDate.getTime() && prevCurrEnd.current == currEndDate.getTime() && prevHistStart.current == histStartDate.getTime() && prevHistEnd.current == histEndDate.getTime()) && currStartDate.getTime() <= currEndDate.getTime() && histStartDate.getTime() <= histEndDate.getTime()))) {

			isAnalyticsLoading.current = true;
			isAdsLoading.current = true;
			isSEOLoading.current = true;
			isGMBLoading.current = true;
			startChart.current = false;
			setAnalyticsData(null);
			setSearchData(null);
			setAdsData(null);
			setBusinessData(null);
            showLoader(true);
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

				isAnalyticsLoading.current = false;
				startChart.current = !(isAnalyticsLoading.current || isAdsLoading.current || isSEOLoading.current || isGMBLoading.current);
				setAnalyticsData(gas_data);
                showLoader(false);

				if(!(gas_data && gas_data.has_history)) alert("No data for historical period");

				axios.get(buildUrl(ads_url)).then(function (response) {
					var gas_data = response.data;
					console.log("got ads data");
					console.log(gas_data);
					if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;

					isAdsLoading.current = false;
					startChart.current = !(isAnalyticsLoading.current || isAdsLoading.current || isSEOLoading.current || isGMBLoading.current);
					setAdsData(gas_data);

					if(!(gas_data && gas_data.has_history)) alert("No ads data for historical period");
				});		

				axios.get(buildUrl(search_url)).then(function (response) {
					var gas_data = response.data;
					console.log("got search data");
					console.log(gas_data);
					if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;

					isSEOLoading.current = false;
					startChart.current = !(isAnalyticsLoading.current || isAdsLoading.current || isSEOLoading.current || isGMBLoading.current);
					setSearchData(gas_data);

					if(!(gas_data && gas_data.has_history)) alert("No seo/ppc data for historical period");
				});

				axios.get(buildUrl(business_url)).then(function (response) {
					var gas_data = response.data;
					console.log("got business data");
					console.log(gas_data);
					if(typeof gas_data !== 'object' || gas_data === null) gas_data = null;

					isGMBLoading.current = false;
					startChart.current = !(isAnalyticsLoading.current || isAdsLoading.current || isSEOLoading.current || isGMBLoading.current);
					setBusinessData(gas_data);

					if(!(gas_data && gas_data.has_history)) alert("No GMB data for historical period");

				});
			});
		} else 
			console.log("all dates not set, or dates not changed");
	}, [currStartDate.getTime(), currEndDate.getTime(), histStartDate.getTime(), histEndDate.getTime(), user.dealership_id]);

    return(
        <>
        <Loading isOpen={loader} />
		<div className="custom-tabs">
			<div className="tab-content" id="myTabContentDate">
				<div className="tab-pane fade show active" id="dt_1" role="tabpanel" aria-labelledby="dt_1_tab">
					<div className="gray-date-box px-0">
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
						</div>
					</div>
				</div>
			</div>
		</div>
        <div className="custom-tabs">
				<ul className="nav nav-tabs" id="myTab" role="tablist">
				  	<li className="nav-item">
				    	<a className="nav-link active" onClick={resizeWindow} id="cs_1_tab" data-toggle="tab" href="#cs_1" role="tab" aria-controls="cs_1" aria-selected="true">Key Metrics</a>
				  	</li>
				  	<li className="nav-item">
				    	<a className="nav-link" id="cs_2_tab" data-toggle="tab" href="#cs_2" role="tab" aria-controls="cs_2" aria-selected="false">SEO / PPC</a>
				  	</li>
				  	<li className="nav-item">
				    	<a className="nav-link" onClick={resizeWindow} id="cs_3_tab" data-toggle="tab" href="#cs_3" role="tab" aria-controls="cs_3" aria-selected="false">GMB</a>
				  	</li>
					<li className="nav-item">
				    	<a className="nav-link" id="cs_4_tab" data-toggle="tab" href="#cs_4" role="tab" aria-controls="cs_4" aria-selected="false">GMB REVIEWS</a>
					</li>
					<li className="nav-item">
				    	<a className="nav-link" id="cs_5_tab" data-toggle="tab" href="#cs_5" role="tab" aria-controls="cs_5" aria-selected="false">GROW REVIEWS</a>
					</li>
				</ul>
				<div className="tab-content" id="myTabContent">
				  	<div className="tab-pane fade show active" id="cs_1" role="tabpanel" aria-labelledby="cs_1_tab">
						<div className="gray-box px-0">
							<div className="container-fluid">
								<div className="l-gray-box mt-40">
									<div className="d-flex">
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Mobile Device Usage
												<span className="info-msg" data-tip="<h6>MOBILE DEVICE USAGE</h6>This is the percentage of mobile devices that access your website compared to desktop users." data-for="stat-7">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-7' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.mobile_usage !== undefined ? getAnalyticsSection(analyticsData.mobile_usage * 100,'percent') : ''}
											{analyticsData && analyticsData.mobile_usage_diff ? getAnalyticsIndicator(analyticsData.mobile_usage_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Website Hits
												<span className="info-msg" data-tip="<h6>WEBSITE HITS</h6>Number of visitors to your website during Current period." data-for="stat-2">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-2' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:sessions'] !== undefined ? getAnalyticsSection(analyticsData.channels.all['ga:sessions']) : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:sessions'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:sessions']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Time on Site
												<span className="info-msg" data-tip="<h6>TIME ON SITE</h6>The average amount of time visitors spends on your site." data-for="stat-3">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-3' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:sessions'] !== undefined ? getAnalyticsSection(analyticsData.channels.all['ga:avgSessionDuration'],'time') : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:avgSessionDuration'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:avgSessionDuration']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Pages / Session
												<span className="info-msg" data-tip="<h6>PAGES PER SESSION</h6>The average amount of pages a visitor views when they visit your website." data-for="stat-4">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-4' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:pageviewsPerSession'] !== undefined ? getAnalyticsSection(analyticsData.channels.all['ga:pageviewsPerSession']) : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:pageviewsPerSession'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:pageviewsPerSession']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Bounce Rate
												<span className="info-msg" data-tip="<h6>BOUNCE RATE</h6>The percent of people that immediately leave after arriving to your website." data-for="stat-5">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-5' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['ga:bounceRate'] !== undefined ? getAnalyticsSection(analyticsData.channels.all['ga:bounceRate'] * 100,'percent') : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['ga:bounceRate'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['ga:bounceRate']) : ''}
										</div>
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="m-title text-uppercase">
                                        Website Hits by Source
                                        <span className="info-msg">
                                            <img className="ico_info" src={infoIcon} alt="info" data-tip="<h6>WEBSITE HITS BY SOURCE</h6>This is a breakdown of where visitors to your site came from during Current time period." data-for="web-hits"/>
											<ReactTooltip id='web-hits' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                                            <div>
                                            </div>
                                        </span>
                                    </div>
									<div className="graph-block">
									{analyticsData && analyticsData.race_chart && <RaceChart graphData={analyticsData.race_chart} startChart={startChart.current} />}
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Top Paid Search Terms
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip='<h6>Top Paid Search Terms</h6>The are the search terms that we most frequently used for visitors to arrive on your website from Google Ads. ' data-for='lead-int'/>
												<ReactTooltip id='lead-int' type='light' place='top' effect='solid' html={true}></ReactTooltip>
											</span>
										</div>
										
									</div>
									<div className="cs-table-block">
										{analyticsData && analyticsData.top_queries && <MoreTable tableData={Object.values(analyticsData.top_queries)} tableType="intercept"/>}
									</div>
								</div>
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Traffic Quality
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip='<h6>Traffic Quality</h6>The gauge the quality of traffic from each source we combine bounce rate, pages per session, avg time on site and other metrics to give an overall score.' data-for='pw-rank'/>
												<ReactTooltip id='pw-rank' type='light' place='top' effect='solid' html={true}></ReactTooltip>
											</span>
										</div>
										<div className="ml-auto">
											<div className="d-flex align-items-center colors-label">
												<div>Current <span className="green-box"></span></div>
												<div className="ml-40">Historical <span className="red-box"></span></div>
											</div>
										</div>
									</div>									
									{analyticsData && analyticsData.bar_chart && <BarChart graphData={analyticsData.bar_chart}/>}
								</div>
							</div>
						</div>
				  	</div>
				  	<div className="tab-pane fade" id="cs_2" role="tabpanel" aria-labelledby="cs_2_tab">
						<div className="gray-box px-0">
							<div className="container-fluid">
								{/* Date Range Block */}

								{/* Data Slide Block */}
								<div className="l-gray-box mt-40">
									<div className="d-flex">
									{/*<OwlCarousel className="dash-card-slider owl-carousel" items={5} slideBy={1} nav>*/}
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Avg Search Position
												<span className="info-msg" data-tip="<h6>AVG SEARCH POSITION</h6>The average rank that your website listing appears on Google across all search terms" data-for="stat-6">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-6' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{searchData && searchData.search_data && searchData.search_data[0] && searchData.search_data[0].position !== undefined ? getAnalyticsSection(searchData.search_data[0].position) : ''}
											{searchData && searchData.search_position_diff ? getAnalyticsIndicator(searchData.search_position_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Conversion Rate
												<span className="info-msg" data-tip="<h6>CONVERSION RATE</h6>This is the percent of website visitors that submit a contact form or call" data-for="stat-8">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-8' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.channels && analyticsData.channels.all['conversion_rate'] !== undefined ? getAnalyticsSection(analyticsData.channels.all['conversion_rate'] * 100,'percent_precise') : ''}
											{analyticsData && analyticsData.channels_diff && analyticsData.channels_diff.all['conversion_rate'] ? getAnalyticsIndicator(analyticsData.channels_diff.all['conversion_rate']) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Phone Calls from Ads
												<span className="info-msg" data-tip="<h6>PHONE CALLS FROM ADS</h6>The amount of people that called your dealership from Google Ads" data-for="stat-9">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-9' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{adsData && adsData.campaign_totals && adsData.campaign_totals.phone_calls !== undefined ? getAnalyticsSection(adsData.campaign_totals.phone_calls) : ''}
											{adsData && adsData.campaign_totals_diff && adsData.campaign_totals_diff.phone_calls !== undefined ? getAnalyticsIndicator(adsData.campaign_totals_diff.phone_calls) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												AdWords Clicks to Site
												<span className="info-msg" data-tip="<h6>AdWords Clicks to Site</h6>The number of visits to your site via AdWords" data-for="stat-11">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-11' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{adsData && adsData.campaign_totals && adsData.campaign_totals.clicks !== undefined !== undefined ? getAnalyticsSection(adsData.campaign_totals.clicks) : ''}
											{adsData && adsData.campaign_totals_diff && adsData.campaign_totals_diff.clicks !== undefined ? getAnalyticsIndicator(adsData.campaign_totals_diff.clicks) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												AdWords Impressions
												<span className="info-msg" data-tip="<h6>AdWords Impressions</h6>This is the number of time your ad has been viewed in search results" data-for="stat-11">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-11' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{adsData && adsData.campaign_totals && adsData.campaign_totals.impressions !== undefined ? getAnalyticsSection(adsData.campaign_totals.impressions) : ''}
											{adsData && adsData.campaign_totals_diff && adsData.campaign_totals_diff.impressions !== undefined ? getAnalyticsIndicator(adsData.campaign_totals_diff.impressions) : ''}
										</div>
									{/*</OwlCarousel>*/}
									</div> 
								</div>
								<div className="l-gray-box mt-40">
									<div className="d-flex">
									{/*<OwlCarousel className="dash-card-slider owl-carousel" items={5} slideBy={1} nav>*/}
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Current Spend
												<span className="info-msg" data-tip="<h6>Current Spend</h6>The total amount spent on AdWords during Current period" data-for="stat-1">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>											
											<ReactTooltip id='stat-1' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{adsData && adsData.campaign_totals && adsData.campaign_totals.cost_micros !== undefined ? getAnalyticsSection(adsData.campaign_totals.cost_micros,'currency') : ''}
											{adsData && adsData.campaign_totals_diff && adsData.campaign_totals_diff.cost_micros !== undefined ? getAnalyticsIndicator(adsData.campaign_totals_diff.cost_micros) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Engagement Rate
												<span className="info-msg" data-tip="<h6>ENGAGEMENT RATE</h6>The percent of people that engage in your site after first visiting" data-for="stat-10">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-10' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.engagement_rate !== undefined ? getAnalyticsSection(analyticsData.engagement_rate * 100,'percent') : ''}
											{analyticsData && analyticsData.engagement_rate_diff ? getAnalyticsIndicator(analyticsData.engagement_rate_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Organic Form Fills
												<span className="info-msg" data-tip="<h6>Organic FORM FILLS</h6>The number of people that have submitted an inquiry on your website not from ads." data-for="stat-7">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-7' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.total_form_fills !== undefined ? getAnalyticsSection(analyticsData.total_form_fills) : ''}
											{analyticsData && analyticsData.form_fills_diff ? getAnalyticsIndicator(analyticsData.form_fills_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												Ads Form Fills
												<span className="info-msg" data-tip="<h6>Ads FORM FILLS</h6>The number of people that have submitted an inquiry on your website from a google ad." data-for="stat-7">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-7' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.ads_form_fills !== undefined ? getAnalyticsSection(analyticsData.ads_form_fills) : ''}
											{analyticsData && analyticsData.ads_form_fills_diff ? getAnalyticsIndicator(analyticsData.ads_form_fills_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center">
												GAS Form Fills
												<span className="info-msg" data-tip="<h6>TG FORM FILLS</h6>The number of people that have submitted an inquiry on your website via trade gauge or a gas landing page." data-for="stat-7">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-7' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{analyticsData && analyticsData.gas_form_fills !== undefined ? getAnalyticsSection(analyticsData.gas_form_fills) : ''}
											{analyticsData && analyticsData.gas_form_fills_diff ? getAnalyticsIndicator(analyticsData.gas_form_fills_diff) : ''}
										</div>
										<div className="col">
											<div className="custom-label text-uppercase text-center" >
												Average CPC
												<span className="info-msg" data-tip="<h6>Average CPC</h6>The total number of paid clicks to your site, divided by the total amount spent for this time period.." data-for="stat-7">												
													<img className="ico_info" src={infoIcon} alt="info" />
												</span>
											</div>
											<ReactTooltip id='stat-7' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											{adsData && adsData.campaign_totals && adsData.campaign_totals.average_cpc !== undefined ? getAnalyticsSection(adsData.campaign_totals.average_cpc,'currency_precise') : ''}
											{adsData && adsData.campaign_totals_diff && adsData.campaign_totals_diff.average_cpc !== undefined ? getAnalyticsIndicator(adsData.campaign_totals_diff.average_cpc) : ''}
										</div>
									{/*</OwlCarousel>*/}
									</div> 
								</div>
											
								{/* Seo Report */}
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											SEO Report 
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip="<h6>SEO REPORT</h6>This is a breakdown of website visitors by search term" data-for="seo-rep"/>
												<ReactTooltip id='seo-rep' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											</span>
										</div>
									</div>
									{/*searchData && searchData.search_data_by_query && <SeoTable seoData={searchData.search_data_by_query}/>*/}
									{searchData && searchData.search_data_by_query && <MoreTable tableData={searchData.search_data_by_query} tableType="seo"/>}
								</div>

								{/* Vehicles Block */}
								<div className="transparent-box mt-40">
									<div className="d-flex align-items-center m-title-flex mb-30">
										<div className="m-title text-uppercase mb-0">
											Top 5 Vehicle Detail Page Views
											<span className="info-msg">
												<img className="ico_info" src={infoIcon} alt="info" data-tip="<h6>TOP 5 VDP VIEWS</h6>Ranking of your VDPs that have the most website visits." data-for="top-vs"/>
												<ReactTooltip id='top-vs' place='top' type='light' effect='solid' html={true}></ReactTooltip>
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
												<img className="ico_info" src={infoIcon} alt="info" data-tip="<h6>REFERRAL TRAFFIC</h6>Ranking of traffic sources to your website by last click attribution." data-for="ref-tf"/>
												<ReactTooltip id='ref-tf' place='top' type='light' effect='solid' html={true}></ReactTooltip>
											</span>
										</div>
									</div>
									{/*analyticsData && analyticsData.sources && <ReferralTable referralData={analyticsData.sources}/>*/}									
									{analyticsData && analyticsData.sources && <MoreTable tableData={Object.values(analyticsData.sources)} tableType="referral"/>}
								</div>
							</div>
						</div>
				  	</div>
				  	<div className="tab-pane fade" id="cs_3" role="tabpanel" aria-labelledby="cs_3_tab">
					  	{businessData && <Gmb businessData={businessData}/>}
				  	</div>
					
					{/* GMB Review */}
					<div className="tab-pane fade" id="cs_4" role="tabpanel" aria-labelledby="cs_4_tab">
					  	{businessData && businessData.reviews && businessData.reviews.reviews && <Review reviewData={businessData.reviews.reviews}/>}
				  	</div>
					
					{/* GROW REVIEWS */}
					<div className="tab-pane fade" id="cs_5" role="tabpanel" aria-labelledby="cs_5_tab">
						<ReviewForm />
					</div>
				</div>
			</div>
        </>
    )
}