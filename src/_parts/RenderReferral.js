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

const RenderReferral = ({tableData}) => {
    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Source</th>
                    <th scope="col">Web Hits Current</th>
                    <th scope="col">Web Hits Historic</th>
                    <th scope="col">Time on Site</th>
                    <th scope="col">Pages / Session</th>
                    <th scope="col">Bounce Rate</th>
                </tr>
            </thead>
            <tbody>
            {tableData.map((referral, index) => (
                <tr key={index}>
                    <td>{referral['source']}</td>
                    <td>{numberFormatter(referral['ga:sessions'])}</td>
                    <td>{numberFormatter(referral['ga:sessions_hist'])}</td>
                    <td>{timeFormatter(referral['ga:avgSessionDuration'])}</td>
                    <td>{numberFormatter(Math.round(referral['ga:pageviewsPerSession']*10)/10)}</td>
                    <td>{numberFormatter(Math.round(referral['ga:bounceRate'] * 100))}%</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default RenderReferral;