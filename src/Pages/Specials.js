import $ from 'jquery';

import '../css/daterangepicker.css';
import '../css/all.css';
import '../css/owl.carousel.min.css';
import '../css/bootstrap.min.css';
import '../css/style.css';
import '../css/new.css';
import '../css/responsive.css';

import axios from 'axios'; 

import VehicleCard from '../components/specials/VehicleCard';
import MainSection from '../components/specials/MainSection';
import 'bootstrap/js/dist/modal';
import { useState, useEffect, useContext, useRef } from 'react';

import {UserContext} from '../context/UserContext';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Index = ({}) => {
	const {user} = useContext(UserContext); 

	// On Add Selected Items Popup
	const [topVehicles, setTopVehicles] = useState([]);
	const [bottomVehicles, setBottomVehicles] = useState([]);

	// On Check Items Popup
	const [selectedTopVehicles, setSelectedTopVehicles] = useState([]);
	const [selectedBottomVehicles, setSelectedBottomVehicles] = useState([]);

	const [allMakes, setAllMakes] = useState(null);
	const [allPriceRanges, setAllPriceRanges] = useState(null);
	const [allDOLRanges, setAllDOLRanges] = useState(null);

	const [filterValues, setFilterValues] = useState([]);

	const [fallbackConfig, setFallbackConfig] = useState(null);

	const protocol = window.location.protocol;
	const inventory_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/inventory.php?gas_dealership=" + user.dealership_id;	

	// Full Vehicle Data
	const [allBottomVehicles, setAllBottomVehicles] = useState([]);
	const [allTopVehicles, setAllTopVehicles] = useState([]);

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
	
	var price_range_step = 10000;
	var dol_step = 30;	

	const getInventory = () => {
		axios.get(inventory_url + "&action=get_inventory").then(function (response) {
			var inventory_data = response.data.vehicles;
			console.log("got inventory data");
			console.log(inventory_data);
			
			if(!(inventory_data && inventory_data.length)) alert("No inventory available");

			var temp_vehicles = [];
			var temp_vehicles_2 = [];

			var temp_top_vehicles = [];
			var temp_bottom_vehicles = [];

			var all_makes = [];
			var all_prices = [];
			var all_dols = [];

			inventory_data.map(function(vehicle,i) {
				if(!all_makes.includes(vehicle['make'])) all_makes.push(vehicle['make']);

				all_prices.push(vehicle['price']);
				all_dols.push(vehicle['tol']);

				temp_vehicles.push({
					id: i,
					src: vehicle['primary_image'],
					title: vehicle['vehicle_name'],
					tagline: vehicle['vehicle_name'],
					price: vehicle['price'],
					mileage: vehicle['mileage'],
					vin: vehicle['vin'],
					stockno: vehicle['stockno'],
					make: vehicle['make'],
					dol: vehicle['tol'],
					filtered: false
				});

				temp_vehicles_2.push({
					id: i + inventory_data.length, 
					src: vehicle['primary_image'],
					title: vehicle['vehicle_name'],
					tagline: vehicle['vehicle_name'],
					price: vehicle['price'],
					mileage: vehicle['mileage'],
					vin: vehicle['vin'],
					stockno: vehicle['stockno'],
					make: vehicle['make'],
					dol: vehicle['tol'],
					filtered: false
				});

				if(vehicle.slider_order == 0) temp_top_vehicles.push(temp_vehicles[temp_vehicles.length - 1]);
				if(vehicle.slider_order == 1) temp_bottom_vehicles.push(temp_vehicles[temp_vehicles_2.length - 1]);
			});

			var min_price = Math.min(...all_prices);
			var max_price = Math.max(...all_prices);

			var min_dol = Math.min(...all_dols);
			var max_dol = Math.max(...all_dols);

			var price_ranges = [];

			for(var i = Math.floor(min_price/price_range_step)*price_range_step; i < max_price; i = i + price_range_step)
				price_ranges.push({'ceiling':i + price_range_step,'text':numberFormatter(i,true) + " - " + numberFormatter(i + price_range_step,true)});

			var dol_ranges = [];		

			for(var i = Math.floor(min_dol/dol_step)*dol_step; i < max_dol; i = i + dol_step)
				dol_ranges.push({'ceiling':i + dol_step,'text':numberFormatter(i) + " - " + numberFormatter(i + dol_step)});

			all_makes.sort(function(a, b){
				if(a < b) { return -1; }
				if(a > b) { return 1; }
				return 0;
			});
			
			setAllDOLRanges(dol_ranges);
			setAllPriceRanges(price_ranges);
			setAllMakes(all_makes);

			setAllTopVehicles(temp_vehicles);
			setAllBottomVehicles(temp_vehicles_2);

			setTopVehicles(temp_top_vehicles);
			setBottomVehicles(temp_bottom_vehicles);

			setFallbackConfig(response.data.fallback);
		}).catch(e => {
			console.log(e);
		});
	}

	useEffectDebugger(() => {
		getInventory();
	}, [user.dealership_id]);

	// Two Open Modals
	const openModal = () => {
		$('#addTopVehiclesModal').modal('show');
	};
	const openCarouselModal = () => {
		$('#addBottomVehiclesModal').modal('show');
	};

	$(document).on('hidden.bs.modal','#addTopVehiclesModal', function (e) {
		setSelectedTopVehicles([]);
	});


	$(document).on('hidden.bs.modal','#addBottomVehiclesModal', function (e) {
		setSelectedBottomVehicles([]);
	});

	const handleFilterChange = e  => {
		var filter_name = e.target.name;
		var filter_value = e.target.value;
		
		filterChange(filter_name,filter_value);
	}

	const filterChange = (filter_name,filter_value) => {
		var temp_top_vehicles = [];
		var temp_bottom_vehicles = [];
		
		var temp_filters = filterValues.filter((item) => item.filter !== filter_name);

		if(filter_value != "all") {
			switch(filter_name) {
				case "topMakeSelect": 
					temp_filters.push({'filter':filter_name,'section':'top','value':filter_value,'filter_text':filter_value});  
					break;
				case "bottomMakeSelect": 
					temp_filters.push({'filter':filter_name,'section':'bottom','value':filter_value,'filter_text':filter_value}); 
					break;
				case "topDOL": 
					filter_value = parseInt(filter_value);
					temp_filters.push({'filter':filter_name,'section':'top','value':filter_value,'filter_text':(filter_value - dol_step) + " - " + filter_value + " Days"}); 
					break;
				case "bottomDOL": 
					filter_value = parseInt(filter_value);
					temp_filters.push({'filter':filter_name,'section':'bottom','value':filter_value,'filter_text':(filter_value - dol_step) + " - " + filter_value + " Days"}); 
					break;
				case "topPrice": 
					filter_value = parseInt(filter_value);
					temp_filters.push({'filter':filter_name,'section':'top','value':filter_value,'filter_text':numberFormatter(filter_value - price_range_step,true) + " - " + numberFormatter(filter_value,true)}); 
					break;
				case "bottomPrice": 
					filter_value = parseInt(filter_value);
					temp_filters.push({'filter':filter_name,'section':'bottom','value':filter_value,'filter_text':numberFormatter(filter_value - price_range_step,true) + " - " + numberFormatter(filter_value,true)});
					break;
				default: break;
			}
		}

		console.log("checking these filters");
		console.log(temp_filters);

		allTopVehicles.map(function(vehicle) { 

			vehicle['filtered'] = false;
			
			temp_filters.map((function(this_filter) {
				if(vehicle['filtered']) return;

				switch(this_filter['filter']) {
					case "topMakeSelect": 
						vehicle['filtered'] = vehicle['make'] != this_filter['value'];
						break;
					case "topDOL": 
						vehicle['filtered'] = !((vehicle['dol'] >= this_filter['value'] - dol_step && vehicle['dol'] <= this_filter['value']));
						break;
					case "topPrice": 
						vehicle['filtered'] = !((vehicle['price'] >= this_filter['value'] - price_range_step && vehicle['price'] <= this_filter['value']));
						break;
					default: break;
				}
			}));

			temp_top_vehicles.push(vehicle);
		});

		allBottomVehicles.map(function(vehicle) { 

			vehicle['filtered'] = false;
			
			temp_filters.map((function(this_filter) {
				if(vehicle['filtered']) return;

				switch(this_filter['filter']) {
					case "bottomMakeSelect": 
						vehicle['filtered'] = vehicle['make'] != this_filter['value'];
						break;
					case "bottomDOL": 
						vehicle['filtered'] = !((vehicle['dol'] >= this_filter['value'] - dol_step && vehicle['dol'] <= this_filter['value']));
						break;
					case "bottomPrice": 
						vehicle['filtered'] = !((vehicle['dol'] >= this_filter['price'] - price_range_step && vehicle['price'] <= this_filter['value']));
						break;
					default: break;
				}
			}));

			temp_bottom_vehicles.push(vehicle);
		});
		
		setFilterValues(temp_filters);
		setAllTopVehicles(temp_top_vehicles);
		setAllBottomVehicles(temp_bottom_vehicles);
	}

	const removeFilter = (this_filter) => {
		
		filterChange(this_filter,"all");
	}

	const saveSettings = () => {
		var inventory_settings = new FormData();

		topVehicles.map(function(vehicle,i) {
			inventory_settings.append('vehicle[]',JSON.stringify({'vin' : vehicle.vin, 'slider_order' : 0}))
		});

		bottomVehicles.map(function(vehicle,i) {
			inventory_settings.append('vehicle[]',JSON.stringify({'vin' : vehicle.vin, 'slider_order' : 1}))
		});

		inventory_settings.append('fallback_query',fallbackConfig);

		axios.post(inventory_url + "&action=save_inventory", inventory_settings).then(function (response) {
			console.log("set inventory data");
			console.log(response.data);

			getInventory();
		}).catch(e => {
			console.log(e);
		});
	}

	return (
		<>
			<MainSection
				topVehicles={topVehicles}
				openModal={openModal}
				selectedTopVehicles={selectedTopVehicles}
				setSelectedTopVehicles={setSelectedTopVehicles}
				setTopVehicles={setTopVehicles}
				bottomVehicles={bottomVehicles}
				openCarouselModal={openCarouselModal}
				selectedBottomVehicles={selectedBottomVehicles}
				setSelectedBottomVehicles={setSelectedBottomVehicles}
				setBottomVehicles={setBottomVehicles}
				allBottomVehicles={allBottomVehicles}
				allTopVehicles={allTopVehicles}
				saveSettings={saveSettings}
				fallbackConfig={fallbackConfig}
				setFallbackConfig={setFallbackConfig}
			/>
			<div
				className='modal fade custom-modal'
				id='addTopVehiclesModal'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='addTopVehiclesModalTitle'
				aria-hidden='true'
			>
				<div
					className='modal-dialog modal-dialog-centered'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5
								className='modal-title'
								id='addTopVehiclesModalTitle'
							>
								Select Inventory
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>×</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='row align-items-end'>
								<div className='col-md-5'>
									<div className='row d-flex date-filter-block'>
										<div className='col'>
											<label className='custom-label'>
												Make
											</label>
											<select className='form-control' name="topMakeSelect" onChange={handleFilterChange}>
												<option value="all">All</option>
												{allMakes && allMakes.map((make, i) => { 
													return (<option key={i} value={make}>{make}</option>);
												})}
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Days in lot
											</label>
											<select className='form-control' name="topDOL" onChange={handleFilterChange}>
												<option value="all">All</option>
												{allDOLRanges && allDOLRanges.map((range, i) => { 
													return (<option key={i} value={range.ceiling}>{range.text}</option>);
												})}
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Price
											</label>
											<select className='form-control' name="topPrice" onChange={handleFilterChange}>
												<option value="all">All</option>
												{allPriceRanges && allPriceRanges.map((range, i) => { 
													return (<option key={i} value={range.ceiling}>{range.text}</option>);
												})}
											</select>
										</div>
									</div>
								</div>
								<div className='col-md-7 text-right pb-5'>
									{filterValues && filterValues.map((this_filter, i) => { 
										return (this_filter['section'] == "top" ? 
											<span key={i} className='tag-box ml-10'>{this_filter['filter_text']}<a onClick={(e) => {e.preventDefault(); removeFilter(this_filter['filter']); $('select[name="' + this_filter['filter'] + '"').val("all");}} className='cross' >x</a></span> 
											: ''
											);
									})}
								</div>
							</div>
							<div className='vehicle-block-row mso-box-block vehicle-block-modal d-flex flex-wrap'>
								{allTopVehicles.length && allTopVehicles
									?.filter(
										vehicle => !(vehicle.filtered || topVehicles.map(vehicle => vehicle.vin).includes(vehicle.vin) || bottomVehicles.map(vehicle => vehicle.vin).includes(vehicle.vin))
									)
									.map((vehicle, idx) => {
										return (
											<div key={idx}
												className={`vehicle-block ${
													selectedTopVehicles.includes(
														vehicle
													)
														? 'selected'
														: ''
												}`}
											>
												<VehicleCard
													data={vehicle}
													cardVehicles={
														selectedTopVehicles
													}
													setCardVehicles={
														setSelectedTopVehicles
													}
												/>
											</div>
										);
									})}
							</div>
						</div>
						<div className='mso-box-bottom text-right mt-30 d-flex align-items-center'>
							<div>
								<span className='select-count text-uppercase'>
									<span className='green-text'>
										{selectedTopVehicles?.length}
									</span>{' '}
									Selected
								</span>
								{selectedTopVehicles?.length > 0 && (
									<button
										className='transparent-btn'
										onClick={e => {
											setSelectedTopVehicles([]);
										}}
									>
										Remove Selected
									</button>
								)}
							</div>
							<div className='ml-auto'>
								<button
									className='green-btn'
									onClick={() => {
										setTopVehicles([
											...topVehicles,
											...selectedTopVehicles,
										]);
										setSelectedTopVehicles([]);
										$('#addTopVehiclesModal').modal('hide');
									}}
									disabled={selectedTopVehicles.length == 0}
								>
									Add Selected Vehicles
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				className='modal fade custom-modal'
				id='addBottomVehiclesModal'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='addBottomVehiclesModalTitle'
				aria-hidden='true'
			>
				<div
					className='modal-dialog modal-dialog-centered'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5
								className='modal-title'
								id='addBottomVehiclesModalTitle'
							>
								Select Inventory
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>×</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='row align-items-end'>
								<div className='col-md-5'>
									<div className='row d-flex date-filter-block'>
										<div className='col'>
											<label className='custom-label'>
												Make
											</label>
											<select className='form-control' name="bottomMakeSelect" onChange={handleFilterChange}>
												<option value="all">All</option>
												{allMakes && allMakes.map((make, i) => { 
													return (<option key={i} value={make}>{make}</option>
													);
												})}
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Days in lot
											</label>
											<select className='form-control' name="bottomDOL" onChange={handleFilterChange}>
												<option value="all">All</option>
												{allDOLRanges && allDOLRanges.map((range, i) => { 
													return (<option key={i} value={range.ceiling}>{range.text}</option>
													);
												})}
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Price
											</label>
											<select className='form-control' name="bottomPrice" onChange={handleFilterChange}>
												<option value="all">All</option>
												{allPriceRanges && allPriceRanges.map((range, i) => { 
													return (<option key={i} value={range.ceiling}>{range.text}</option>
													);
												})}
											</select>
										</div>
									</div>
								</div>
								<div className='col-md-7 text-right pb-5'>
									{filterValues && filterValues.map((this_filter, i) => { 
										return (this_filter['section'] == "bottom" ? 
											<span key={i} className='tag-box ml-10'>{this_filter['filter_text']}<a onClick={(e) => {e.preventDefault(); removeFilter(this_filter['filter']);}} className='cross' >x</a></span> 
											: ''
											);
									})}
								</div>
							</div>
							<div className='vehicle-block-row mso-box-block vehicle-block-modal d-flex flex-wrap'>
								{allBottomVehicles.length && allBottomVehicles
									?.filter(
										vehicle => !(vehicle.filtered || topVehicles.map(vehicle => vehicle.vin).includes(vehicle.vin) || bottomVehicles.map(vehicle => vehicle.vin).includes(vehicle.vin))
									)
									.map((vehicle, idx) => {
										return (
											<div key={idx}
												className={`vehicle-block ${
													selectedBottomVehicles.includes(
														vehicle
													)
														? 'selected'
														: ''
												}`}
											>
												<VehicleCard
													data={vehicle}
													cardVehicles={
														selectedBottomVehicles
													}
													setCardVehicles={
														setSelectedBottomVehicles
													}
												/>
											</div>
										);
									})}
							</div>
						</div>
						<div className='mso-box-bottom text-right mt-30 d-flex align-items-center'>
							<div>
								<span className='select-count text-uppercase'>
									<span className='green-text'>
										{selectedBottomVehicles?.length}
									</span>{' '}
									Selected
								</span>
								{selectedBottomVehicles?.length > 0 && (
									<button
										className='transparent-btn'
										onClick={e => {
											setSelectedBottomVehicles([]);
										}}
									>
										Remove Selected
									</button>
								)}
							</div>
							<div className='ml-auto'>
								<button
									className='green-btn'
									onClick={() => {
										setBottomVehicles([
											...bottomVehicles,
											...selectedBottomVehicles,
										]);
										setSelectedBottomVehicles([]);
										$('#addBottomVehiclesModal').modal('hide');
									}}
									disabled={selectedBottomVehicles.length == 0}
								>
									Add Selected Vehicles
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Index;
