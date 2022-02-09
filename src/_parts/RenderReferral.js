import React from 'react';

const RenderReferral = ({referralData}) => {
    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Source</th>
                    <th scope="col">Clicks</th>
                    <th scope="col">Impressions</th>
                    <th scope="col">Avg Position</th>
                    <th scope="col">CTR</th>
                </tr>
            </thead>
            <tbody>
            {referralData.map((referral, index) => (
                <tr key={index}>
                    <td>{referral.source}</td>
                    <td>{referral.clicks}</td>
                    <td>{referral.impression}</td>
                    <td>{referral.avg_pos}</td>
                    <td>{referral.ctr}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default RenderReferral;