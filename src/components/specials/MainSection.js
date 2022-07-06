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
	saveSettings,
	fallbackConfig,
	setFallbackConfig,
	settingsSaving,
	ownedConfig,
	setOwnedConfig
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
							fallbackConfig={fallbackConfig}
							setFallbackConfig={setFallbackConfig}
							ownedConfig={ownedConfig}
							setOwnedConfig={setOwnedConfig}
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
							{settingsSaving ? <>
								<button className='green-btn disabled' disabled={true}>
									<div className="float-points">
										<div className="dot-collision"></div>
									</div>
								</button>
							</> : <>
								<button className='green-btn' onClick={(e) => {e.preventDefault(); saveSettings();}}>Save Changes</button>
							</>}
							{/* {!settingsSaving && } */}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MainSection;
