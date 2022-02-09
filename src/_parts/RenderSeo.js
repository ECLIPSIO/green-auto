import React from 'react';

const RenderSeo = ({seoData}) => {
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
            {seoData.map((seo, index) => (
                <tr key={index}>
                    <td>{seo.keyword}</td>
                    <td>{seo.clicks}</td>
                    <td>{seo.impression}</td>
                    <td>{seo.avg_pos}</td>
                    <td>{seo.ctr}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default RenderSeo;