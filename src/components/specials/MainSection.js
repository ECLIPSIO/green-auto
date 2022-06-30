import CarouselSection from './CarouselSection';
import MainSliderSection from './MainSliderSection';
const MainSection = ({
	vehicles,
	openModal,
	selectedVehicles,
	setSelectedVehicles,
	setVehicles,
	carouselVehicles,
	openCarouselModal,
	selectedCarouselVehicles,
	setSelectedCarouselVehicles,
	setCarouselVehicles,
	selectVehicles,
	selectCarouselVehicles,
}) => {
	return (
		<section className='main-block'>
			<div className='container-fluid'>
				<div className='gray-box pl-0 pr-0 pb-0 mso-box'>
					<div className='container-fluid'>
						<MainSliderSection
							vehicles={vehicles}
							openModal={openModal}
							selectedVehicles={selectedVehicles}
							setSelectedVehicles={setSelectedVehicles}
							setVehicles={setVehicles}
							selectVehicles={selectVehicles}
						/>
						<CarouselSection
							carouselVehicles={carouselVehicles}
							openCarouselModal={openCarouselModal}
							selectedCarouselVehicles={selectedCarouselVehicles}
							setSelectedCarouselVehicles={
								setSelectedCarouselVehicles
							}
							setCarouselVehicles={setCarouselVehicles}
							selectCarouselVehicles={selectCarouselVehicles}
						/>
					</div>
					<div className='mso-box-bottom text-right'>
						<div className='ml-auto'>
							<button className='green-btn'>Save Changes</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MainSection;
