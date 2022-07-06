import React, { useEffect, useState } from 'react';
import InfoIcon from '../../img/ico-info.svg';
import ShowPreview from '../../img/icon-eye.png';
import VehicleCard from './VehicleCard';
import WarningIcon from '../../img/gray-warning.png';
import {
	GridContextProvider,
	GridDropZone,
	GridItem,
	swap,
} from 'react-grid-dnd';
function SliderTop({
	topVehicles,
	openModal,
	selectedTopVehicles,
	setSelectedTopVehicles,
	setTopVehicles,
	allTopVehicles,
	fallbackConfig,
	setFallbackConfig
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
		const nextState = swap(topVehicles, sourceIndex, targetIndex);
		setTopVehicles(nextState);
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
					page. 
				</div>
				<div className='d-flex align-items-center m-title-flex mb-30 mt-30'>
					<div className='m-title text-uppercase mb-0 fw-600'>
						Main Slider
						<span className='info-msg'>
							<img className='ico_info' src={InfoIcon} /> <div />
						</span>
					</div>
					<div className='item-count ml-45'>
						{topVehicles?.length} of {allTopVehicles?.length}
					</div>
					<div className='ml-45 custom-form'>
						<select className='form-control mnw-186' name="fallback_query" value={fallbackConfig} onChange={e => setFallbackConfig(e.target.value)}>
							<option value="">Select Fallback</option>
							<option value="oldest_12_used_query">Oldest 12 Used</option>
							<option value="oldest_8_new_query">Oldest 8 new</option>
							<option value="newest_8_query">Newest 8</option>
							<option value="newest_10_query">Newest 10</option>
							<option value="lowest_8_price">Lowest 8 by Price</option>
							<option value="highest_8_price">Highest 8 by Price</option>
						</select>
					</div>
					<div className='ml-auto'>
						{selectedTopVehicles?.length > 0 && (
							<button
								className='transparent-btn'
								onClick={() => {
									let arr = [];
									arr = topVehicles.filter(
										vehicle =>
											!selectedTopVehicles.find(
												selected =>
													selected.id == vehicle.id
											)
									);
									setTopVehicles(arr);
									setSelectedTopVehicles([]);
								}}
							>
								Remove Selected
							</button>
						)}
						<button
							className='green-btn'
							data-toggle='modal'
							data-target='#addTopVehiclesModal'
							onClick={openModal}
						>
							Add Vehicles
						</button>
					</div>
				</div>
				<div className='border-box-block mso-box-block'>
					{topVehicles.length == 0 ? (
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
								data-target='#addTopVehiclesModal'
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
											Math.ceil(topVehicles.length / 4),
									}}
								>
									{topVehicles?.map((vehicle, idx) => (
										<GridItem
											key={vehicle.title + vehicle.id}
											className={`vehicle-block ${
												selectedTopVehicles.includes(
													vehicle
												)
													? 'selected'
													: ''
											} ${idx > 3 ? 'mt-2' : ''}`}
										>
											<div>
												<VehicleCard
													cardVehicles={
														selectedTopVehicles
													}
													setCardVehicles={
														setSelectedTopVehicles
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
										{topVehicles?.map((vehicle, idx) => (
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
															selectedTopVehicles.includes(
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
															selectedTopVehicles={
																selectedTopVehicles
															}
															setSelectedTopVehicles={
																setSelectedTopVehicles
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
							Select from 2 - {allTopVehicles.length} vehicles to showcase on this
							section
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SliderTop;
