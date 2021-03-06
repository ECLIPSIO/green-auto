import React, { useState } from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import ctPointLabels from './ChartistUtils';
// import {ctBarLabels} from 'chartist-plugin-barlabels';
import '../css/chartist.min.css';
// require('chartist');
const options = {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    scaleMinSpace: 10,
    low: 0,
    high: 100,
    
    axisX: {
        offset: 50,
        onlyInteger: true,
    
        labelOffset: {
            x: -10,
            y: 0
        },
    },

    axisY: {
        offset: 70,
        showGrid: false
    },
    plugins: [
        ctPointLabels({
            textAnchor: 'right'
        })
    ]
    // plugins : [
    //     ctBarLabels()
    // ]

};

const data = {
    labels: ['Google', 'Car Gurus', 'Facebook', 'Trader', 'Other', 'Lorem', 'Ipsum'],
    series: [
        [50, 40, 30, 70, 50, 90, 30],
        [30, 20, 90, 50, 40, 60, 40]
    ]
};

const type = "Bar";

const responsive = [
    // Options override for media < 480px
    ['screen and (max-width: 480px)', {
      reverseData: true,
      horizontalBars: true,
      ticks: [20, 40, 60, 80, 100],
    }]
  ];

export default function BarChart({graphData}){
    return(
        <>
            <ChartistGraph className="graph-block ct-chart ct-major-twelfth" id="power-ranking" data={graphData} options={options} type={type} responsiveOptions={responsive} />
        </>
    )
}

