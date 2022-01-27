import React, {useEffect, useState} from 'react';
import axios from 'axios'; 
import infoIcon from '../img/ico-info.svg';

import BarChart from '../charts/BarChart';
import RaceChart from '../charts/RaceChart';
import {RangeDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
export default function HomeTabs(){
	const histDate = {
		start : new Date("2022-01-01"),
		end   : new Date("2022-01-31"),
		startPlace: "From",
		endPlace: "To",
		class : "hist-dates"
	};
	
	const currDate = {
		start : new Date("2022-01-01"),
		end   : new Date("2022-01-31"),
		startPlace: "From",
		endPlace: "To",
		class : "curr-dates"
	};
	const [histStartDate, setHistStartDate] = useState(histDate.start);
	const [histEndDate, setHistEndDate] = useState(histDate.end);
	const [currStartDate, setCurrStartDate] = useState(currDate.start);
	const [currEndDate, setCurrEndDate] = useState(currDate.end);
    // console.log('Init');
	const histDateChanges = (...dates) =>{
		console.table({
			histS:dates[0],
			histE:dates[1]
		});
		// setHistStartDate(dates[0]);
		// setHistEndDate(dates[1]);
		if(dates[0] && dates[1]) reloadReportData();
	};
	const currDateChanges = (...dates) =>{
		console.table({
			currS:dates[0],
			currE:dates[1]
		});
		// setCurrStartDate(dates[0]);
		// setCurrEndDate(dates[1]);
		if(dates[0] && dates[1]) reloadReportData();
	};

	var gas_data;
	
	const url = 'http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com/bridge/analytics/gas.php';

	/*const [data, setData] = useState('');*/

	const reloadReportData = () => {
		axios.get(url).then(function (response) {
			gas_data = response.data;
			console.log("got data");
			console.log(gas_data);
			setAnalyticsData(gas_data);
		});
	}

	const [isLoading, setLoading] = useState(true);
  	const [analyticsData, setAnalyticsData] = useState();

	useEffect(() => {
		console.log("getting data");

		axios.get(url).then(function (response) {
			gas_data = response.data;
			console.log("got data");
			console.log(gas_data);
			setAnalyticsData(gas_data);
			setLoading(false);
		});
	}, []);

	//reloadReportData();
	//setData("This is data from Parent Component to the Child Component.");

	if (isLoading) {
		return <div className="App">Loading...</div>;
	}

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
										<RaceChart/>
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
											    <tr>
											      	<td>Carmax Albany</td>
											      	<td>21</td>
											      	<td>18</td>
											      	<td>$2.23</td>
											      	<td>1:45</td>
											      	<td>12</td>
											      	<td>2.4%</td>
											    </tr>
											    <tr>
											      	<td>Used Cars Albany</td>
											      	<td>65</td>
											      	<td>54</td>
											      	<td>$1.09</td>
											      	<td>2:16</td>
											      	<td>24</td>
											      	<td>1.6%</td>
											    </tr>
											    <tr>
											      	<td>Carmax Albany</td>
											      	<td>21</td>
											      	<td>18</td>
											      	<td>$2.23</td>
											      	<td>1:45</td>
											      	<td>12</td>
											      	<td>2.4%</td>
											    </tr>
											    <tr>
											      	<td>Used Cars Albany</td>
											      	<td>65</td>
											      	<td>54</td>
											      	<td>$1.09</td>
											      	<td>2:16</td>
											      	<td>24</td>
											      	<td>1.6%</td>
											    </tr>
											    <tr>
											      	<td>Carmax Albany</td>
											      	<td>21</td>
											      	<td>18</td>
											      	<td>$2.23</td>
											      	<td>1:45</td>
											      	<td>12</td>
											      	<td>2.4%</td>
											    </tr>
											    <tr>
											      	<td>Used Cars Albany</td>
											      	<td>65</td>
											      	<td>54</td>
											      	<td>$1.09</td>
											      	<td>2:16</td>
											      	<td>24</td>
											      	<td>1.6%</td>
											    </tr>
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
									<BarChart graphData={analyticsData.bar_chart}/>
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