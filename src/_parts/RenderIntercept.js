import React from 'react';
	  
const numberFormatter = (value, currency = false) => {
    var num = value ? value.toString().replace(/[^0-9\.]+/g,"") : 0;
    
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

const RenderIntercept = ({tableData}) => {
    return(
        <table className="table table-striped">
            <thead>
            <tr>
                <th scope="col">Search Term</th>
                <th scope="col">Web Hits Current</th>
                <th scope="col">Web Hits Historic</th>
                <th scope="col">Cost</th>
                <th scope="col">Time on Site</th>
                <th scope="col">Pages / Session</th>
                <th scope="col">Bounce Rate</th>
            </tr>
            </thead>
            <tbody>
            {tableData.map((intercept, index) => (
                    <tr key={index}>
                        <td>{intercept["ga:keyword"]}</td>
                        <td>{intercept["ga:sessions"]}</td>
                        <td>{intercept["ga:sessions_hist"] ? intercept["ga:sessions_hist"] : "-"}</td>
                        <td>{numberFormatter(Math.round(intercept["cost"]),true)}</td>
                        <td>{timeFormatter(intercept["ga:avgSessionDuration"])}</td>
                        <td>{numberFormatter(intercept["ga:pageviewsPerSession"])}</td>
                        <td>{numberFormatter(Math.round(intercept["ga:bounceRate"] * 100))}%</td>
                    </tr>
             ))
            }
            </tbody>
    </table>
        
    )
}

export default RenderIntercept;