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

const RenderSeo = ({tableData}) => {
    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Keyword</th>
                    <th scope="col">Clicks</th>
                    <th scope="col">Impressions</th>
                    <th scope="col">Avg Position</th>
                    <th scope="col">CTR</th>
                </tr>
            </thead>
            <tbody>
            {tableData.map((seo, index) => (
                <tr key={index}>
                    <td>{seo.dimensions.query}</td>
                    <td>{numberFormatter(seo.clicks)}</td>
                    <td>{numberFormatter(seo.impressions)}</td>
                    <td>{numberFormatter(seo.position)}</td>
                    <td>{numberFormatter(seo.ctr * 100)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default RenderSeo;