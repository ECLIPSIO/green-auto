import React, { useEffect, useState } from 'react';
import InfoIcon from '../img/ico-info.svg';
import ShowPreview from '../img/icon-eye.png';
import VehicleCard from '../components/VehicleCard';
import WarningIcon from '../img/gray-warning.png';
import {
	GridContextProvider,
	GridDropZone,
	GridItem,
	swap,
} from 'react-grid-dnd';
function MainSliderSection({
	vehicles,
	openModal,
	selectedVehicles,
	setSelectedVehicles,
	setVehicles,
	selectVehicles,
}) {
	const getItemStyle = (isDragging, draggableStyle) => ({
		...draggableStyle,
	});
	let [update, setUpdate] = useState(false);

	const getListStyle = isDraggingOver => ({
		display: 'flex',
	});
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};
	const onChange = (sourceId, sourceIndex, targetIndex, targetId) => {
		const nextState = swap(vehicles, sourceIndex, targetIndex);
		setVehicles(nextState);
	};
	useEffect(() => {
		window.addEventListener('resize', () =>
			setUpdate(prevState => !prevState)
		);
		return () => {
			window.removeEventListener('resize', () =>
				setUpdate(prevState => !prevState)
			);
		};
	}, []);
	const getHeight = () => {
		return innerWidth * 0.24;
	};
	return (
		<>
			<div className='gray-box-block'>
				<div className='main-heading'>MANAGE SPECIAL OFFERS PAGE</div>
				<div className='sub-heading'>
					Choose the vehicles you want to promote on your specials
					page. Lorem ipsum dolor sit amet, consectetur adipisicing
					elit.
				</div>
				<div className='d-flex align-items-center m-title-flex mb-30 mt-30'>
					<div className='m-title text-uppercase mb-0 fw-600'>
						Main Slider
						<span className='info-msg'>
							<img className='ico_info' src={InfoIcon} /> <div />
						</span>
					</div>
					<div className='item-count ml-45'>
						{vehicles?.length} of {selectVehicles?.length}
					</div>
					{vehicles?.length > 0 && (
						<div className='ml-45 custom-form'>
							<select className='form-control mnw-186'>
								<option>Select Fallback</option>
							</select>
						</div>
					)}
					<div className='ml-auto'>
						{selectedVehicles?.length > 0 && (
							<button
								className='transparent-btn'
								onClick={() => {
									let arr = [];
									arr = vehicles.filter(
										vehicle =>
											!selectedVehicles.find(
												selected =>
													selected.id == vehicle.id
											)
									);
									setVehicles(arr);
									setSelectedVehicles([]);
								}}
							>
								Remove Selected
							</button>
						)}
						<button
							className='green-btn'
							data-toggle='modal'
							data-target='#addVehiclesModal'
							onClick={openModal}
						>
							Add Vehicles
						</button>
					</div>
				</div>
				<div className='border-box-block mso-box-block'>
					{vehicles.length == 0 ? (
						<div class='text-center no-data-box'>
							<div>
								<img src={WarningIcon} />
							</div>
							<div class='no-vehicle-tag-line mt-10'>
								No Vehicles Added
							</div>
							<button
								class='transparent-btn mt-10'
								type='button'
								data-toggle='modal'
								data-target='#addVehiclesModal'
								onClick={openModal}
							>
								Add Vehicles
							</button>
						</div>
					) : (
						<GridContextProvider onChange={onChange}>
							<div className='vehicle-block-row'>
								<GridDropZone
									id='items'
									boxesPerRow={4}
									rowHeight={getHeight()}
									style={{
										height:
											getHeight() *
											Math.ceil(vehicles.length / 4),
									}}
								>
									{vehicles?.map((vehicle, idx) => (
										<GridItem
											key={vehicle.title + vehicle.id}
											className={`vehicle-block ${
												selectedVehicles.includes(
													vehicle
												)
													? 'selected'
													: ''
											} ${idx > 3 ? 'mt-2' : ''}`}
										>
											<div>
												<VehicleCard
													selectedVehicles={
														selectedVehicles
													}
													setSelectedVehicles={
														setSelectedVehicles
													}
													data={vehicle}
												/>
											</div>
										</GridItem>
									))}
								</GridDropZone>
							</div>
							{/* <Droppable
								droppableId='droppable'
								direction='horizontal'
							>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										style={getListStyle(
											snapshot.isDraggingOver
										)}
										{...provided.droppableProps}
										className='vehicle-block-row flex-wrap'
									>
										{vehicles?.map((vehicle, idx) => (
											<Draggable
												key={vehicle.title + vehicle.id}
												draggableId={
													vehicle.title + vehicle.id
												}
												index={idx}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={getItemStyle(
															snapshot.isDragging,
															provided
																.draggableProps
																.style
														)}
														className={`vehicle-block ${
															selectedVehicles.includes(
																vehicle
															)
																? 'selected'
																: ''
														} ${
															idx > 3
																? 'mt-4'
																: ''
														}`}
													>
														<VehicleCard
															selectedVehicles={
																selectedVehicles
															}
															setSelectedVehicles={
																setSelectedVehicles
															}
															data={vehicle}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable> */}
						</GridContextProvider>
					)}
				</div>
				<div className='mt-15 text-center'>
					<div className='d-inline-flex align-items-center'>
						<div className='mso-info green-text d-none'>
							<img src={ShowPreview} /> Show Preview
						</div>
						<div className='mso-info ml-40'>
							Select from {vehicles.length} -{' '}
							{selectVehicles.length} vehicles to showcase on this
							section
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default MainSliderSection;
