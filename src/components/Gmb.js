import React, {useState, useEffect} from 'react';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
const OwlCarousel = require('react-owl-carousel');
import ReactTooltip from 'react-tooltip';
import Chart from 'react-apexcharts'
import "react-google-flight-datepicker/dist/main.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import infoIcon from '../img/ico-info.svg';

export default function Gmb({businessData}){

    var tempDate = new Date();
	if(tempDate.getDate() >= 7) tempDate.setDate(1);
	else {
		tempDate.setMonth(tempDate.getMonth() - 1);
		tempDate.setDate(1);
	}
	tempDate.setHours(0,0,0,0);
	const [currGmbStartDate, setCurrGmbStartDate] = useState(tempDate);

	var tempDate = new Date();
	if(tempDate.getDate() < 7) tempDate.setDate(0);
	tempDate.setHours(0,0,0,0);
	const [currGmbEndDate, setCurrGmbEndDate] = useState(tempDate);

	var tempDate = new Date(currGmbStartDate.getTime());
	tempDate.setMonth(tempDate.getMonth() - 1);
	const [histGmbStartDate, setHistGmbStartDate] = useState(tempDate);

	var tempDate = new Date(currGmbEndDate.getTime());
	tempDate.setMonth(tempDate.getMonth() - 1);
	if(tempDate.getMonth() != histGmbStartDate.getMonth()) {
		tempDate = new Date(histGmbStartDate.getTime());
		tempDate.setMonth(tempDate.getMonth() + 1);
		tempDate.setDate(0);
	}
	const [histGmbEndDate, setHistGmbEndDate] = useState(tempDate);

	const histGmbDate = {
		start : histGmbStartDate,
		end   : histGmbEndDate,
		startPlace: "From",
		endPlace: "To",
		class : "hist-gmb-dates"
	};
	
	const currGmbDate = {
		start : currGmbStartDate,
		end   : currGmbEndDate,
		startPlace: "From",
		endPlace: "To",
		class : "curr-gmb-dates"
	};

    const histGmbDateChanges = (...dates) =>{
		setHistGmbStartDate(dates[0]);
		setHistGmbEndDate(dates[1]);
	};
	const currGmbDateChanges = (...dates) =>{
		setCurrGmbStartDate(dates[0]);
		setCurrGmbEndDate(dates[1]);
	};

    const numberFormatter = (value, currency = false) => {
		var num = value ? value.toString().replace(/[^0-9\.]+/g,"") : 0;
        var thousands = num > 1000;

        if(thousands) num = Math.round(num / 100) / 10;
		
		var sign = num >= 0 ? "" : "-";
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
		return((currency ? "$" : "") + sign + formatted + ((parts) ? "." + parts[1].substr(0, 2) : "") + (thousands ? "k" : ""));
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

    const chartOptions = {
        chart: {
            id: "gm-chart",
            toolbar:{
              show:false
            },
            events: {
                mounted: (chart) => {
                    chart.windowResizeHandler();
                    chart.width('100%');
                }
            }
        },
        foreColor: "#ccc",
        colors: ["#a4db5f"],
        stroke: {
            curve: 'straight',
            width: 1,
            lineCap: 'square'
        },
        grid: {
            borderColor: "#555",
            clipMarkers: true,
            strokeDashArray: 5,
            yaxis: {
                lines: {
                    show: true
                }
            },
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            gradient: {
                enabled: true,
                opacityFrom: 0.75,
                opacityTo: 0.3
            }
        },
        markers: {
            size: 3,
            colors: ["#aae95e"],
            strokeColor: "#aae95e",
            strokeWidth: 3
        },
        xaxis: {
            categories: businessData.VIEWS_MAPS_series_category
        },
        yaxis:{
            min:0,
            tickAmount:4
        }
    };
    const [seriesData, setSeriesData] = useState([1,1,1,1,1,1,1,1,1,1,1,1]);
    const chartSeries = [{
        name: "Searches",
        data: seriesData
    }];

    useEffect(()=>{
        // console.log(businessData);
        setSeriesData(businessData.VIEWS_MAPS_series_data);
        // window.dispatchEvent(new Event('resize'));
        // console.clear();
        // console.log('Resize Triggred');
    },[]);
    return (
        <div className="gray-box px-0">
            <div className="container-fluid">
                <div className="l-gray-box mt-40">
                    <div className="d-flex">
                    {/*<OwlCarousel className="dash-card-slider owl-carousel" items={5} slideBy={1} nav>*/}
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">
                                # of Clicks
                                <span className="info-msg" data-tip="<h6># OF CLICKS</h6>The number of visits to your GMB account for current period" data-for="stat-12">												
                                    <img className="ico_info" src={infoIcon} alt="info" />
                                </span>
                            </div>
							<ReactTooltip id='stat-12' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                            {businessData && businessData.massaged_metrics && businessData.massaged_metrics.ACTIONS_WEBSITE !== undefined ? getAnalyticsSection(businessData.massaged_metrics.ACTIONS_WEBSITE) : ''}
							{businessData && businessData.metrics_diff && businessData.metrics_diff.ACTIONS_WEBSITE ? getAnalyticsIndicator(businessData.metrics_diff.ACTIONS_WEBSITE) : ''}
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">
                                # of Views
                                <span className="info-msg" data-tip="<h6># OF VIEWS</h6>The number of times your GMB listing was viewed (may or may not have been clicked)" data-for="stat-13">												
                                    <img className="ico_info" src={infoIcon} alt="info" />
                                </span>
                            </div>
							<ReactTooltip id='stat-13' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                            {businessData && businessData.massaged_metrics && businessData.massaged_metrics.total_views !== undefined ? getAnalyticsSection(businessData.massaged_metrics.total_views) : ''}
							{businessData && businessData.metrics_diff && businessData.metrics_diff.total_views ? getAnalyticsIndicator(businessData.metrics_diff.total_views) : ''}
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">
                                # of Calls
                                <span className="info-msg" data-tip="<h6># OF CALLS</h6>The number of calls from your GMB account" data-for="stat-14">												
                                    <img className="ico_info" src={infoIcon} alt="info" />
                                </span>
                            </div>
							<ReactTooltip id='stat-14' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                            {businessData && businessData.massaged_metrics && businessData.massaged_metrics.ACTIONS_PHONE !== undefined ? getAnalyticsSection(businessData.massaged_metrics.ACTIONS_PHONE) : ''}
							{businessData && businessData.metrics_diff && businessData.metrics_diff.ACTIONS_PHONE ? getAnalyticsIndicator(businessData.metrics_diff.ACTIONS_PHONE) : ''}
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">
                                Search Views
                                <span className="info-msg" data-tip="<h6>SEARCH VIEWS</h6>The amount of times you GMB listing was shown in search results" data-for="stat-15">												
                                    <img className="ico_info" src={infoIcon} alt="info" />
                                </span>
                            </div>
							<ReactTooltip id='stat-15' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                            {businessData && businessData.massaged_metrics && businessData.massaged_metrics.VIEWS_SEARCH !== undefined ? getAnalyticsSection(businessData.massaged_metrics.VIEWS_SEARCH) : ''}
							{businessData && businessData.metrics_diff && businessData.metrics_diff.VIEWS_SEARCH ? getAnalyticsIndicator(businessData.metrics_diff.VIEWS_SEARCH) : ''}
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">
                                Map Views
                                <span className="info-msg" data-tip="<h6>MAP VIEWS</h6>The number of times viewers saw your listing on Google Maps" data-for="stat-16">												
                                    <img className="ico_info" src={infoIcon} alt="info" />
                                </span>
                            </div>
							<ReactTooltip id='stat-16' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                            {businessData && businessData.massaged_metrics && businessData.massaged_metrics.VIEWS_MAPS !== undefined ? getAnalyticsSection(businessData.massaged_metrics.VIEWS_MAPS) : ''}
							{businessData && businessData.metrics_diff && businessData.metrics_diff.VIEWS_MAPS ? getAnalyticsIndicator(businessData.metrics_diff.VIEWS_MAPS) : ''}
                        </div>
                    {/*</OwlCarousel>*/}
                    </div>
                </div>
                <div className="score-block">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="gc-box">
                                <div className="green-gradient-circle">
                                    <div className="green-circle-inside">
                                        <div className="gc-count">{businessData && businessData.reviews && businessData.reviews.averageRating !== undefined ? numberFormatter(businessData.reviews.averageRating) : ''}</div>
                                    </div>
                                </div>
                                <div className="sb-title">
                                    Avg Review Score&nbsp;
                                    <img className="ico_info_in" src={infoIcon} alt="info" data-tip="<h6>AVG REVIEW SCORE</h6>The overall average of all reviews left on your GMB account" data-for="review-score"/>
                                    <ReactTooltip id='review-score' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="gc-box">
                                <div className="green-gradient-circle">
                                    <div className="green-circle-inside">
                                        <div className="gc-count">{businessData && businessData.massaged_metrics && businessData.massaged_metrics.total_actions !== undefined ? numberFormatter(businessData.massaged_metrics.total_actions) : ''}</div>
                                    </div>
                                </div>
                                <div className="sb-title">
                                    Actions Taken&nbsp;
                                    <img className="ico_info_in" src={infoIcon} alt="info" data-tip="<h6>ACTIONS TAKEN</h6>A total of all actions taken from your GMB account including calls, directions, messages & website visits" data-for="actions-taken"/>
                                    <ReactTooltip id='actions-taken' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="gc-box">
                                <div className="green-gradient-circle">
                                    <div className="green-circle-inside">
                                        <div className="gc-count">{businessData && businessData.massaged_metrics && businessData.massaged_metrics.ACTIONS_DRIVING_DIRECTIONS !== undefined ? numberFormatter(businessData.massaged_metrics.ACTIONS_DRIVING_DIRECTIONS) : ''}</div>
                                    </div>
                                </div>
                                <div className="sb-title">
                                    Directions Requested&nbsp;
                                    <img className="ico_info_in" src={infoIcon} alt="info" data-tip="<h6>DIRECTIONS REQUESTED</h6>The number of directions requested for current time period" data-for="directions-requested"/>
								    <ReactTooltip id='directions-requested' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="transparent-box mt-40">
                    <div className="d-flex align-items-center m-title-flex mb-30">
                        <div className="m-title text-uppercase mb-0">
                            Google Maps Searches
                            <span className="info-msg">
                                <img className="ico_info" src={infoIcon} alt="info" data-tip="<h6>GOOGLE MAPS SEARCHES</h6>The number of times your listing was shown on Google Maps by day " data-for="gmb-ser"/>
                                <ReactTooltip id='gmb-ser' place='top' type='light' effect='solid' html={true}></ReactTooltip>
                            </span>
                        </div>
                    </div>
                    <div className="graph-block">
                        <Chart options={chartOptions} series={chartSeries} type="area" height={320} />
                    </div>
                </div>
            </div>
        </div>
    )
}