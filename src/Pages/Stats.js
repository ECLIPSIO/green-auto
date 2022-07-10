import WeekStats from "../_parts/WeekStats";
import statDataJson from '../data/week-stats.json';
import { useState } from 'react';
export default function Stats(){
    let [statData, setStatData] = useState(statDataJson);
    return(
        <>
        <section className='main-block'>
            <div className="container-fluid">
                <WeekStats statData={statData} setStatData={setStatData} />
            </div>
        </section>
        </>
    )
}