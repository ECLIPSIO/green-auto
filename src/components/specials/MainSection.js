import SliderBottom from './SliderBottom';
import SliderTop from './SliderTop';
const MainSection = ({
	topVehicles,
	openModal,
	selectedTopVehicles,
	setSelectedTopVehicles,
	setTopVehicles,
	bottomVehicles,
	openCarouselModal,
	selectedBottomVehicles,
	setSelectedBottomVehicles,
	setBottomVehicles,
	allTopVehicles,
	allBottomVehicles,
	saveSettings
}) => {
	return (
		<section className='main-block'>
			<div className='container-fluid'>
				<div className='gray-box pl-0 pr-0 pb-0 mso-box'>
					<div className='container-fluid'>
						<SliderTop
							topVehicles={topVehicles}
							openModal={openModal}
							selectedTopVehicles={selectedTopVehicles}
							setSelectedTopVehicles={setSelectedTopVehicles}
							setTopVehicles={setTopVehicles}
							allTopVehicles={allTopVehicles}
						/>
						<SliderBottom
							bottomVehicles={bottomVehicles}
							openCarouselModal={openCarouselModal}
							selectedBottomVehicles={selectedBottomVehicles}
							setSelectedBottomVehicles={
								setSelectedBottomVehicles
							}
							setBottomVehicles={setBottomVehicles}
							allBottomVehicles={allBottomVehicles}
						/>
					</div>
					<div className='mso-box-bottom text-right'>
						<div className='ml-auto'>
							<button className='green-btn' onClick={(e) => {e.preventDefault(); saveSettings($('select[name="fallback_query"]').val());}}>Save Changes</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MainSection;
