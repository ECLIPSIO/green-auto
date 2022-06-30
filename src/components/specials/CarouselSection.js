import React, { useEffect, useState } from 'react';
import InfoIcon from '../../img/ico-info.svg';
import ShowPreview from '../../img/icon-eye.png';
import WarningIcon from '../../img/gray-warning.png';
import VehicleCard from './VehicleCard';
import {
	GridContextProvider,
	GridDropZone,
	GridItem,
	swap,
} from 'react-grid-dnd';

function CarouselSection({
	carouselVehicles,
	openCarouselModal,
	selectedCarouselVehicles,
	setSelectedCarouselVehicles,
	setCarouselVehicles,
	selectCarouselVehicles,
}) {
	const getItemStyle = (isDragging, draggableStyle) => ({
		...draggableStyle,
	});

	const getListStyle = isDraggingOver => ({
		display: 'flex',
	});
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};
	const getHeight = () => {
		return innerWidth * 0.24;
	};
	let [update, setUpdate] = useState(false);
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
	const onChange = (sourceId, sourceIndex, targetIndex, targetId) => {
		console.log({ sourceId, sourceIndex, targetIndex, targetId });
		const nextState = swap(carouselVehicles, sourceIndex, targetIndex);
		console.log({ nextState });
		setCarouselVehicles(nextState);
	};
	return (
		<>
			<div className='gray-box-block mt-45'>
				<div className='d-flex align-items-center m-title-flex mb-30'>
					<div className='m-title text-uppercase mb-0 fw-600'>
						Carousel
						<span className='info-msg'>
							<img className='ico_info' src={InfoIcon} /> <div />
						</span>
					</div>
					<div className='item-count ml-45'>
						{carouselVehicles?.length} of{' '}
						{selectCarouselVehicles?.length}
					</div>
					{carouselVehicles?.length > 0 && (
						<div className='ml-45 custom-form'>
							<select className='form-control mnw-186'>
								<option>Oldest Vehicles</option>
							</select>
						</div>
					)}

					<div className='ml-auto'>
						{selectedCarouselVehicles?.length > 0 && (
							<button
								className='transparent-btn'
								onClick={() => {
									let arr = [];
									arr = carouselVehicles.filter(
										vehicle =>
											!selectedCarouselVehicles.find(
												selected =>
													selected.id == vehicle.id
											)
									);
									setCarouselVehicles(arr);
									setSelectedCarouselVehicles([]);
								}}
							>
								Remove Selected
							</button>
						)}
						<button
							className='green-btn'
							data-toggle='modal'
							data-target='#addCarouselVehiclesModal'
							onClick={openCarouselModal}
						>
							Add Vehicles
						</button>
					</div>
				</div>
				<div className='border-box-block mso-box-block'>
					{carouselVehicles?.length == 0 ? (
						<div className='text-center no-data-box'>
							<div>
								<img src={WarningIcon} />
							</div>
							<div className='no-vehicle-tag-line mt-10'>
								No Vehicles Added
							</div>
							<button
								className='transparent-btn mt-10'
								type='button'
								data-toggle='modal'
								data-target='#addCarouselVehiclesModal'
								onClick={openCarouselModal}
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
											Math.ceil(
												carouselVehicles.length / 4
											),
									}}
								>
									{carouselVehicles?.map((vehicle, idx) => (
										<GridItem
											key={vehicle.title + vehicle.id}
											className={`vehicle-block ${
												selectedCarouselVehicles.includes(
													vehicle
												)
													? 'selected'
													: ''
											} ${idx > 3 ? 'mt-2' : ''}`}
										>
											<div>
												<VehicleCard
													selectedVehicles={
														selectedCarouselVehicles
													}
													setSelectedVehicles={
														setSelectedCarouselVehicles
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
							Select from {carouselVehicles.length} -{' '}
							{selectCarouselVehicles.length} vehicles to showcase
							on this section
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CarouselSection;
