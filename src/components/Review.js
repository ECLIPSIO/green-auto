import React, {useState, useEffect} from 'react';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
import ReviewBlock from './ReviewBlock';

export default function Review({reviewData}) {
    const total = reviewData.length;
    const perPage = 2;
    const [current, setCurrent] = useState(1);
    const totalPages = total > 0 ? Math.ceil(total/perPage) : 0;
    const [currentData, setCurrentData] = useState([]);

    const selectPage = (page) => {
        const last = page - 1;
        const start = last * perPage;
        const end = page * perPage;
        const sliced = reviewData.slice(start, end);
        setCurrentData(sliced);
        setCurrent(page);
    }

    const nextPage = () => {
        if(current < totalPages){
            const page = current + 1;
            selectPage(page);
            setCurrent(page);
        }
    }

    const prevPage = () => {
        if(current > 1){
            const page = current - 1;
            selectPage(page);
            setCurrent(page);
        }
    }

    const generatePage = () => {
        const elem = [];
        if(totalPages > 0){
            elem.push(<li className={`${current == 1 ? 'page-item disabled' : 'page-item'}`} key='page0'>
            <a className="page-link" href="" onClick={e => {e.preventDefault(); prevPage();}} tabIndex="-1" aria-disabled="true">Previous</a>
            </li>);

            for (let i = 1; i <= totalPages; i++) {
                elem.push(<li className={`${i==current ? 'page-item active' : 'page-item'}`} key={'page'+i}><a className="page-link" href="" onClick={(e) => {e.preventDefault(); selectPage(i)}}>{i}</a></li>);
            }

            elem.push(<li className={`${current == totalPages ? 'page-item disabled' : 'page-item'}`} key={'page' + (totalPages + 1)}>
            <a className="page-link" href="" onClick={e => {e.preventDefault(); nextPage();}}>Next</a>
            </li>);
        }
        return elem;
    }

    
    useEffect(() => {
        // console.table(reviewData);
        selectPage(1);
    }, []);
    return (
        <div className="gray-box pl-0 pr-0">
			<div className="container-fluid plr-78">
                {currentData && currentData.map((r, i) => {
                    return <ReviewBlock review={r} key={'1000'+i}/>
                })}
                <div className="text-center pagination-block">
                    <nav aria-label="Page navigation example" className="d-inline-block">
                        <ul className="pagination justify-content-end">
                            {generatePage()}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}