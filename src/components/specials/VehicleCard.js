import React from 'react';

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

const VehicleCard = ({
	cardVehicles,
	setCardVehicles,
	data,
	...props
}) => {
	const handleChange = e => {
		if (e.target.checked == true) {
			let newArr = [...cardVehicles, data];
			setCardVehicles(newArr);
		} else {
			setCardVehicles(prevState => {
				let newArr = prevState.filter(arr => arr.id !== data.id);
				return [...newArr];
			});
		}
	};
	return (
		<div className='vehicle-box' data-make={data.make} data-price={data.price} data-dol={data.dol}>
			<div className='vehicle-top'>
				<img src={data.src} />
				<div className='custom-checkbox'>
					<input
						className='styled-checkbox'
						id={data.id}
						type='checkbox'
						checked={cardVehicles.includes(data)}
						onChange={handleChange}
					/>
					<label htmlFor={data.id} />
				</div>
			</div>
			<div className='vehicle-bottom'>
				<div className='vehicle-title'>
					{data.title}
				</div>
				<div className='vehicle-sub-title'>Stock - {data.stockno}<br/>Vin - {data.vin}</div>
				<div className='vb-flex d-flex'>
					<div className='mso-price'>{numberFormatter(data.price,true)}</div>
					<div className='mso-mi ml-auto'>{numberFormatter(data.mileage)}</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleCard;
