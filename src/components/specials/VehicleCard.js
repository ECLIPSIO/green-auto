import React from 'react';

const VehicleCard = ({
	selectedVehicles,
	setSelectedVehicles,
	data,
	...props
}) => {
	const handleChange = e => {
		if (e.target.checked == true) {
			let newArr = [...selectedVehicles, data];
			setSelectedVehicles(newArr);
		} else {
			setSelectedVehicles(prevState => {
				let newArr = prevState.filter(arr => arr.id !== data.id);
				return [...newArr];
			});
		}
	};
	return (
		<div className='vehicle-box'>
			<div className='vehicle-top'>
				<img src={data.src} />
				<div className='custom-checkbox'>
					<input
						className='styled-checkbox'
						id={data.id}
						type='checkbox'
						checked={selectedVehicles.includes(data)}
						onChange={handleChange}
					/>
					<label htmlFor={data.id} />
				</div>
			</div>
			<div className='vehicle-bottom'>
				<div className='vehicle-title'>
					{data.model} {data.title}
				</div>
				<div className='vehicle-sub-title'>{data.tagline}</div>
				<div className='vb-flex d-flex'>
					<div className='mso-price'>{data.price}</div>
					<div className='mso-mi ml-auto'>{data.running}</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleCard;
