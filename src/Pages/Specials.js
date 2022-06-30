import $ from 'jquery';

import '../css/daterangepicker.css';
import '../css/all.css';
import '../css/owl.carousel.min.css';
import '../css/bootstrap.min.css';
import '../css/style.css';
import '../css/new.css';
import '../css/responsive.css';

import axios from 'axios'; 

import VehicleImage from '../img/car1.jpg';
import VehicleImage2 from '../img/car2.jpg';
import VehicleImage3 from '../img/car3.jpg';
import VehicleImage4 from '../img/car4.jpg';
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
	const [vehicles, setVehicles] = useState([]);
	const [carouselVehicles, setCarouselVehicles] = useState([]);

	// On Check Items Popup
	const [selectedVehicles, setSelectedVehicles] = useState([]);
	const [selectedCarouselVehicles, setSelectedCarouselVehicles] = useState(
		[]
	);

	const protocol = window.location.protocol;
	const inventory_url = (protocol == "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/inventory.php?gas_dealership=" + user.dealership_id;	

	// For Dummy Data
	const [selectCarouselVehicles, setSelectCarouselVehicles] = useState([
		{
			id: 9,
			src: VehicleImage,
			title: 'Ferrari',
			model: 2015,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$275,000',
			running: '12,000 mi',
		},
		{
			id: 10,
			src: VehicleImage2,
			title: 'Monster Truck',
			model: 2012,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$375,000',
			running: '1,000 mi',
		},
		{
			id: 11,
			src: VehicleImage3,
			title: 'Bike',
			model: 2020,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$75,000',
			running: '500 mi',
		},
		{
			id: 12,
			src: VehicleImage4,
			title: 'GTR',
			model: 2022,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$475,000',
			running: '2,000 mi',
		},
		{
			id: 13,
			src: VehicleImage,
			title: 'Ferrari',
			model: 2015,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$275,000',
			running: '12,000 mi',
		},
		{
			id: 14,
			src: VehicleImage2,
			title: 'Monster Truck',
			model: 2012,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$375,000',
			running: '1,000 mi',
		},
		{
			id: 15,
			src: VehicleImage3,
			title: 'Bike',
			model: 2020,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$75,000',
			running: '500 mi',
		},
		{
			id: 16,
			src: VehicleImage4,
			title: 'GTR',
			model: 2022,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$475,000',
			running: '2,000 mi',
		},
	]);
	const [selectVehicles, setSelectVehicles] = useState([
		{
			id: 1,
			src: VehicleImage,
			title: 'Ferrari',
			model: 2015,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$275,000',
			running: '12,000 mi',
		},
		{
			id: 2,
			src: VehicleImage2,
			title: 'Monster Truck',
			model: 2012,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$375,000',
			running: '1,000 mi',
		},
		{
			id: 3,
			src: VehicleImage3,
			title: 'Bike',
			model: 2020,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$75,000',
			running: '500 mi',
		},
		{
			id: 4,
			src: VehicleImage4,
			title: 'GTR',
			model: 2022,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$475,000',
			running: '2,000 mi',
		},
		{
			id: 5,
			src: VehicleImage,
			title: 'Ferrari',
			model: 2015,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$275,000',
			running: '12,000 mi',
		},
		{
			id: 6,
			src: VehicleImage2,
			title: 'Monster Truck',
			model: 2012,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$375,000',
			running: '1,000 mi',
		},
		{
			id: 7,
			src: VehicleImage3,
			title: 'Bike',
			model: 2020,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$75,000',
			running: '500 mi',
		},
		{
			id: 8,
			src: VehicleImage4,
			title: 'GTR',
			model: 2022,
			tagline: '458 Italia Spider Deluxe Edition',
			price: '$475,000',
			running: '2,000 mi',
		},
	]);

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

		axios.get(inventory_url + "&action=get_inventory").then(function (response) {
			var inventory_data = response.data;
			console.log("got inventory data");
			console.log(inventory_data);
			
			if(!(inventory_data && inventory_data.length)) alert("No inventory available");

			var temp_vehicles = [];
			var temp_vehicles_2 = [];

			inventory_data.map(function(vehicle,i) {
				temp_vehicles.push({
					id: i,
					src: vehicle['primary_image'],
					title: vehicle['make'],
					model: vehicle['year'],
					tagline: vehicle['vehicle_name'],
					price: vehicle['price'],
					running: vehicle['mileage'],
				});

				temp_vehicles_2.push({
					id: i + inventory_data.length,
					src: vehicle['primary_image'],
					title: vehicle['make'],
					model: vehicle['year'],
					tagline: vehicle['vehicle_name'],
					price: vehicle['price'],
					running: vehicle['mileage'],
				})
			});

			setSelectCarouselVehicles(temp_vehicles);

			setSelectVehicles(temp_vehicles_2);
		});	

	}, [user.dealership_id]);

	// Two Open Modals
	const openModal = () => {
		$('#addVehiclesModal').modal('show');
	};
	const openCarouselModal = () => {
		$('#addCarouselVehiclesModal').modal('show');
	};

	/*useEffect(() => {
		$('#addVehiclesModal').on('hidden.bs.modal', function (e) {
			setSelectedVehicles([]);
		});
		$('#addCarouselVehiclesModal').on('hidden.bs.modal', function (e) {
			setSelectedCarouselVehicles([]);
		});
	}, []);*/

	return (
		<>
			<MainSection
				vehicles={vehicles}
				openModal={openModal}
				selectedVehicles={selectedVehicles}
				setSelectedVehicles={setSelectedVehicles}
				setVehicles={setVehicles}
				carouselVehicles={carouselVehicles}
				openCarouselModal={openCarouselModal}
				selectedCarouselVehicles={selectedCarouselVehicles}
				setSelectedCarouselVehicles={setSelectedCarouselVehicles}
				setCarouselVehicles={setCarouselVehicles}
				selectCarouselVehicles={selectCarouselVehicles}
				selectVehicles={selectVehicles}
			/>
			<div
				className='modal fade custom-modal'
				id='addVehiclesModal'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='addVehiclesModalTitle'
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
								id='addVehiclesModalTitle'
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
											<select className='form-control'>
												<option>All</option>
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Days in lot
											</label>
											<select className='form-control'>
												<option>30+ Days</option>
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Price
											</label>
											<select className='form-control'>
												<option>Under $40k</option>
											</select>
										</div>
									</div>
								</div>
								<div className='col-md-7 text-right pb-5'>
									<span className='tag-box'>
										All{' '}
										<a
											onClick={(e) => {e.preventDefault();}}
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										+30 Days{' '}
										<a
											onClick={(e) => {e.preventDefault();}}
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										Under $40k{' '}
										<a
											onClick={(e) => {e.preventDefault();}}
											className='cross'
										>
											x
										</a>
									</span>
								</div>
							</div>
							<div className='vehicle-block-row mso-box-block vehicle-block-modal d-flex flex-wrap'>
								{selectVehicles
									?.filter(
										vehicle => !vehicles.includes(vehicle)
									)
									.map((vehicle, idx) => {
										return (
											<div key={idx}
												className={`vehicle-block ${
													selectedVehicles.includes(
														vehicle
													)
														? 'selected'
														: ''
												}`}
											>
												<VehicleCard
													data={vehicle}
													selectedVehicles={
														selectedVehicles
													}
													setSelectedVehicles={
														setSelectedVehicles
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
										{selectedVehicles?.length}
									</span>{' '}
									Selected
								</span>
								{selectedVehicles?.length > 0 && (
									<button
										className='transparent-btn'
										onClick={e => {
											setSelectedVehicles([]);
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
										setVehicles([
											...vehicles,
											...selectedVehicles,
										]);
										setSelectedVehicles([]);
										$('#addVehiclesModal').modal('hide');
									}}
									disabled={selectedVehicles.length == 0}
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
				id='addCarouselVehiclesModal'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='addCarouselVehiclesModalTitle'
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
								id='addCarouselVehiclesModalTitle'
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
											<select className='form-control'>
												<option>All</option>
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Days in lot
											</label>
											<select className='form-control'>
												<option>30+ Days</option>
											</select>
										</div>
										<div className='col'>
											<label className='custom-label'>
												Price
											</label>
											<select className='form-control'>
												<option>Under $40k</option>
											</select>
										</div>
									</div>
								</div>
								<div className='col-md-7 text-right pb-5'>
									<span className='tag-box'>
										All{' '}
										<a
											onClick={(e) => {e.preventDefault();}}
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										+30 Days{' '}
										<a
											onClick={(e) => {e.preventDefault();}}
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										Under $40k{' '}
										<a
											onClick={(e) => {e.preventDefault();}}
											className='cross'
										>
											x
										</a>
									</span>
								</div>
							</div>
							<div className='vehicle-block-row mso-box-block vehicle-block-modal d-flex flex-wrap'>
								{selectCarouselVehicles
									?.filter(
										vehicle =>
											!carouselVehicles.includes(vehicle)
									)
									.map((vehicle, idx) => {
										return (
											<div key={idx}
												className={`vehicle-block ${
													selectedCarouselVehicles.includes(
														vehicle
													)
														? 'selected'
														: ''
												}`}
											>
												<VehicleCard
													data={vehicle}
													selectedVehicles={
														selectedCarouselVehicles
													}
													setSelectedVehicles={
														setSelectedCarouselVehicles
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
										{selectedCarouselVehicles?.length}
									</span>{' '}
									Selected
								</span>
								{selectedCarouselVehicles?.length > 0 && (
									<button
										className='transparent-btn'
										onClick={e => {
											setSelectedCarouselVehicles([]);
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
										setCarouselVehicles([
											...carouselVehicles,
											...selectedCarouselVehicles,
										]);
										setSelectedCarouselVehicles([]);
										$('#addCarouselVehiclesModal').modal(
											'hide'
										);
									}}
									disabled={
										selectedCarouselVehicles.length == 0
									}
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
