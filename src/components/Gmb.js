import React, {useState} from 'react';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
const OwlCarousel = require('react-owl-carousel');
import {RangeDatePicker} from "react-google-flight-datepicker";
import ReactTooltip from 'react-tooltip';
import Chart from 'react-apexcharts'
import "react-google-flight-datepicker/dist/main.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import infoIcon from '../img/ico-info.svg';
import graphImg from '../img/graph.jpg';

export default function Gmb(){

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

    const chartOptions = {
        chart: {
            id: "gm-chart",
            toolbar:{
              show:false
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
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]
        },
        yaxis:{
            min:0,
            tickAmount:4
        }
    };
    const chartSeries = [{
        name: "Searchs",
        data: [750, 1200, 1500, 1000, 2000, 3200, 1400, 1400, 3000, 1800, 1900, 2500]
    }];

    return (
        <div className="gray-box px-0">
            <div className="container-fluid">
                <div className="row date-filter-block">
                    <div className="col-md-5">
                        <label className="custom-label text-uppercase">Historical</label>
                        <RangeDatePicker
                            startDate={histGmbStartDate}
                            endDate={histGmbEndDate}
                            onChange={histGmbDateChanges}
                            dateFormat="D MMM YYYY"
                            monthFormat="MMM YYYY"
                            startDatePlaceholder={histGmbDate.startPlace}
                            endDatePlaceholder={histGmbDate.endPlace}
                            disabled={false}
                            className={histGmbDate.class}
                            startWeekDay="monday"
                            highlightToday={true}
                        />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                        <label className="custom-label text-uppercase">Current</label>
                        <RangeDatePicker
                            startDate={currGmbStartDate}
                            endDate={currGmbEndDate}
                            onChange={currGmbDateChanges}
                            dateFormat="D MMM YYYY"
                            monthFormat="MMM YYYY"
                            startDatePlaceholder={currGmbDate.startPlace}
                            endDatePlaceholder={currGmbDate.endPlace}
                            disabled={false}
                            className={currGmbDate.class}
                            startWeekDay="monday"
                            highlightToday={true}
                        />
                    </div>
                </div>
                <div className="l-gray-box mt-40">
                    <OwlCarousel className="dash-card-slider owl-carousel" items={5} slideBy={1} nav>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Current Spend</div>
                            <div className="m-value">$921</div>
                            <div className="p-value red"><div className="down-arrow"></div> 0.7 %</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Website Hits</div>
                            <div className="m-value">823</div>
                            <div className="p-value green"><div className="up-arrow"></div> 1.2 %</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Time on Site</div>
                            <div className="m-value">3:45</div>
                            <div className="p-value green"><div className="up-arrow"></div> 2.3 %</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Pages / Session</div>
                            <div className="m-value">174</div>
                            <div className="p-value red"><div className="down-arrow"></div> 1.8%</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Bounce Rate</div>
                            <div className="m-value">0.431</div>
                            <div className="p-value red"><div className="down-arrow"></div> 0.5%</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Current Spend</div>
                            <div className="m-value">$921</div>
                            <div className="p-value red"><div className="down-arrow"></div> 0.7 %</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Website Hits</div>
                            <div className="m-value">823</div>
                            <div className="p-value green"><div className="up-arrow"></div> 1.2 %</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Time on Site</div>
                            <div className="m-value">3:45</div>
                            <div className="p-value green"><div className="up-arrow"></div> 2.3 %</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Pages / Session</div>
                            <div className="m-value">174</div>
                            <div className="p-value red"><div className="down-arrow"></div> 1.8%</div>
                        </div>
                        <div className="col">
                            <div className="custom-label text-uppercase text-center">Bounce Rate</div>
                            <div className="m-value">0.431</div>
                            <div className="p-value red"><div className="down-arrow"></div> 0.5%</div>
                        </div>
                    </OwlCarousel>
                </div>
                <div className="score-block">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="gc-box">
                                <div className="green-gradient-circle">
                                    <div className="green-circle-inside">
                                        <div className="gc-count">4.5</div>
                                    </div>
                                </div>
                                <div className="sb-title">Avg Review Score</div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="gc-box">
                                <div className="green-gradient-circle">
                                    <div className="green-circle-inside">
                                        <div className="gc-count">8.1</div>
                                    </div>
                                </div>
                                <div className="sb-title">GMB Rating</div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="gc-box">
                                <div className="green-gradient-circle">
                                    <div className="green-circle-inside">
                                        <div className="gc-count">1.3k</div>
                                    </div>
                                </div>
                                <div className="sb-title">Avg Review Score</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="transparent-box mt-40">
                    <div className="d-flex align-items-center m-title-flex mb-30">
                        <div className="m-title text-uppercase mb-0">
                            Google Maps Searches
                            <span className="info-msg">
                                <img className="ico_info" src={infoIcon} alt="info" data-tip="Google Maps Searches" data-for="gmb-ser"/>
                                <ReactTooltip id='gmb-ser' place='top' type='light' effect='solid'></ReactTooltip>
                            </span>
                        </div>
                    </div>
                    <div className="graph-block">
                        <Chart options={chartOptions} series={chartSeries} type="area" width={'100%'} height={320} />
                    </div>
                </div>
            </div>
        </div>
    )
}