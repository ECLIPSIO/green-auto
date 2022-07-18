import WeekStats from "../_parts/WeekStats";
import { useState } from 'react';
export default function Stats(){
    let [statData, setStatData] = useState(null);
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