import WeekStats from "../_parts/WeekStats";
import statDataJson from '../data/week-stats.json';
export default function Stats(){
    return(
        <>
        <section className='main-block'>
            <div className="container-fluid">
            <WeekStats statData={statDataJson}/>
            </div>
        </section>
        </>
    )
}