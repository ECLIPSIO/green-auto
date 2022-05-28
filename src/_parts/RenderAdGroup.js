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

const timeFormatter = (seconds, start = 14, length = 5) => {
    //minutes seconds 14,5  hours minutes seconds 11,8
    seconds = seconds ? seconds : 0;
    return new Date(seconds * 1000).toISOString().substr(start, length);
}

const RenderAdGroup = ({tableData}) => {
    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Ad Group</th>
                    <th scope="col">AVG CPC</th>
                    <th scope="col">CLICKS</th>
                    <th scope="col">CONVERSION RATE</th>
                    <th scope="col">CONVERSIONS</th>
                    <th scope="col">COST</th>
                    <th scope="col">COST/CONVERSION</th>
                    <th scope="col">IMPRESSIONS</th>
                </tr>
            </thead>
            <tbody>
            {tableData.map((ad_group, index) => (
                <tr key={index}>
                    <td>{ad_group['adGroup']['campaign_name']} - {ad_group['adGroup']['name']}</td>
                    <td>{numberFormatter(ad_group['metrics']['calc_averageCpc'],'currency')}</td>
                    <td>{numberFormatter(ad_group['metrics']['clicks'])}</td>
                    <td>{numberFormatter(Math.round(ad_group['metrics']['conversionsFromInteractionsRate']*100)/100)}</td>
                    <td>{numberFormatter(ad_group['metrics']['conversions'])}</td>
                    <td>{numberFormatter(ad_group['metrics']['calc_costMicros'],'currency')}</td>
                    <td>{numberFormatter(ad_group['metrics']['calc_costPerConversion'],'currency')}</td>
                    <td>{numberFormatter(ad_group['metrics']['impressions'])}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default RenderAdGroup;