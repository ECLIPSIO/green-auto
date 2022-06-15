import $ from 'jquery';

import '../css/daterangepicker.css';
import '../css/all.css';
import '../css/owl.carousel.min.css';
import '../css/bootstrap.min.css';
import '../css/style.css';
import '../css/new.css';
import '../css/responsive.css';

import VehicleImage from '../img/car1.jpg';
import VehicleImage2 from '../img/car2.jpg';
import VehicleImage3 from '../img/car3.jpg';
import VehicleImage4 from '../img/car4.jpg';
import VehicleCard from '../components/VehicleCard';
import MainSection from '../components/MainSection';
import 'bootstrap/js/dist/modal';
import { useState } from 'react';
import { useEffect } from 'react';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Index = ({}) => {
	// On Add Selected Items Popup
	const [vehicles, setVehicles] = useState([]);
	const [carouselVehicles, setCarouselVehicles] = useState([]);

	// On Check Items Popup
	const [selectedVehicles, setSelectedVehicles] = useState([]);
	const [selectedCarouselVehicles, setSelectedCarouselVehicles] = useState(
		[]
	);

	// For Dummy Data
	const [selectCarouselVehicles, setSelectCarouselVehicles] = useState([
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
	]);

	// Two Open Modals
	const openModal = () => {
		$('#addVehiclesModal').modal('show');
	};
	const openCarouselModal = () => {
		$('#addCarouselVehiclesModal').modal('show');
	};

	useEffect(() => {
		$('#addVehiclesModal').on('hidden.bs.modal', function (e) {
			setSelectedVehicles([]);
		});
		$('#addCarouselVehiclesModal').on('hidden.bs.modal', function (e) {
			setSelectedCarouselVehicles([]);
		});
	}, []);
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
											href='javascript:void(0);'
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										+30 Days{' '}
										<a
											href='javascript:void(0);'
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										Under $40k{' '}
										<a
											href='javascript:void(0);'
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
											<div
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
											href='javascript:void(0);'
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										+30 Days{' '}
										<a
											href='javascript:void(0);'
											className='cross'
										>
											x
										</a>
									</span>
									<span className='tag-box ml-10'>
										Under $40k{' '}
										<a
											href='javascript:void(0);'
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
											<div
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
