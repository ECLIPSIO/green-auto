import React, { useEffect } from "react";
import * as d3 from "d3";
// import {attrs, styles} from 'd3-selection-multi';
import './d3-multi-selection.min.js';
import data from './data.csv';
// require('./d3-multi-selection.min.js');

var tickDuration = 1000;
let top_n = 10;
let height = 300;
let width = 600;
let firstYear;
let lastYear;
let datesByYear = [];
let colors = [ '#343E2F', '#46533B', "#98b580", "#98b580" ];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function BarChartRace(brandData,startChart){

    var max_year = 0;

    brandData.forEach(d => {
        max_year = d.year > max_year ? d.year : max_year;
    });

    console.log(brandData);

    tickDuration = startChart && max_year > 0 ? 3500 / max_year : 350000;
    
    const halo = function(text, strokeWidth) {
        text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .styles({
            fill: 'white',
            stroke: 'white',
            'stroke-width': strokeWidth,
            'stroke-linejoin': 'round',
            opacity: 0
        });
        // console.log('Hal Calleds');
    };

    d3.select("#raceGraph").html(null);
    
    const  svgC = d3.select("#raceGraph").append("div")
        // Container class to make it responsive.
        .classed("svg-container", true) 
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "+width+" 600")
        // Class to make it responsive.
        .classed("svg-content-responsive", true);
    const svg = svgC //attr("width", width).attr("height", height);

    // Define the div for the tooltip
    var div = d3.select("#raceGraph").append("div")	
    .attr("class", "tooltip")			
    .style("opacity", 0);

    var grad = svgC.append('defs')
      .append('linearGradient')
      .attr('id', 'grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%').attr("spreadMethod", "pad");
      
    grad.selectAll('stop')
      .data(colors)
      .enter()
      .append('stop')
      .style('stop-color', function(d){ return d; })
      .attr('offset', function(d,i){
        return 100 * (i / (colors.length - 1)) + '%';
      }).attr("stop-opacity", 1);

        
    const margin = {
      top: 30,
      right: 0,
      bottom: 5,
      left: 0
    };

    // let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);
    let barPadding = 5;
    let year = firstYear;

    brandData.forEach(d => {
      d.value = +d.value,
      d.lastValue = +d.lastValue,
        d.value = isNaN(d.value) ? 0 : d.value,
         d.year = +d.year,
        d.colour = d3.hsl(Math.random() * 360, 0.75, 0.75)
    });

    let yearSlice = brandData.filter(d => d.year == year && !isNaN(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, top_n);

    yearSlice.forEach((d, i) => d.rank = i);

    let x = d3.scaleLinear()
      .domain([0, d3.max(yearSlice, d => d.value)])
      .range([margin.left, width - margin.right - 65]);

    let y = d3.scaleLinear()
      .domain([top_n, 0])
      .range([height - margin.bottom, margin.top]);

    let xAxis = d3.axisTop()
      .scale(x)
      .ticks(width > 500 ? 5 : 2)
      .tickSize(-(height - margin.top - margin.bottom))
      .tickFormat(d => d3.format(',')(d));

    svg.append('g')
      .attrs({
        class: 'axis xAxis',
        transform: `translate(0, ${margin.top})`
      })
      .call(xAxis)
      .selectAll('.tick line')
      .classed('origin', d => d == 0);
          
    svg.selectAll('rect.bar')
      .data(yearSlice, d => d.name)
      .enter()
      .append('rect')
      .attr("id", d => `${d.name.replace(/\s/g,'_')}`)
      .attrs({
        class: 'bar',
        x: x(0) + 1,
        width: d => x(d.value) > x(0) + 1 ? x(d.value) - x(0) - 1 : 0,
        y: d => y(d.rank) + 5,
        height: 21.5 // For bar height
        // height: y(1) - y(0) - barPadding
      })
      .styles({
        fill: d => 'url(#grad)' //"rgb(84 138 84)"//d.colour //#74bc74
      }).on("mouseover", function(d) {	
        let name = d3.select(this).attr("id");
        name = `${name.replace('_',' ')}`
        d3.selectAll(".bar").style("opacity", 0.5)
        d3.select(this).style("opacity", 1)
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div	.html(name)	
            .style("left", (event.pageX - 20) + "px")		
            .style("top", (event.pageY - 48) + "px");
            
      }).on("mouseout", function(d) {	
        d3.selectAll(".bar").style("opacity", 1)
         div.transition()		
           .duration(500)		
           .style("opacity", 0);
      });	
        

    svg.selectAll('text.label')
      .data(yearSlice, d => d.name)
      .enter()
      .append('text')
      .attrs({
        class: 'label',
        x: d => x(d.value) - 8,
        y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1,
        'text-anchor': 'end'
      })
      .html('');
      // .html(d => d.name);

    svg.selectAll('text.valueLabel')
      .data(yearSlice, d => d.name)
      .enter()
      .append('text')
      .attrs({
        class: 'valueLabel',
        x: d => (x(d.value) > 530 && x(d.value)-105 > 0) ? x(d.value) - 105 : x(d.value) + 3,
        y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1,
      })
      .text(d => d.name + ' (' + d3.format(',.0f')(d.lastValue) + ')');
      let yearText = svg.append('text')
      .attrs({
        class: 'yearText',
        x: width - margin.right - 40,
        y: height - 100
      })
      .styles({
        'text-anchor': 'end'
      })
      .html(getFormattedDate(datesByYear[year]))
      .call(halo, 10);

    let ticker = d3.interval(e => {

        yearSlice = brandData.filter(d => d.year == year && !isNaN(d.value))
        .sort((a, b) => b.value - a.value)
        .slice(0, top_n+1);

            
        yearSlice.forEach((d, i) => d.rank = i);

        x.domain([0, d3.max(yearSlice, d => d.value)]);

        svg.select('.xAxis')
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis);

        let bars = svg.selectAll('.bar').data(yearSlice, d => d.name);
          
        bars
        .enter()
        .append('rect')
        .attr("id", d => `${d.name.replace(/\s/g,'_')}`)
        .attrs({
          class: d => `bar`,
          x: x(0) + 1,
          width: d => x(d.value) > x(0) + 1 ? x(d.value) - x(0) - 1 : 0,
          y: d => y(top_n + 1) + 5,
          height: 21.5 // for bar height
          // height: y(1) - y(0) - barPadding
        })
        .styles({
          fill: d => 'url(#grad)' //"rgb(84 138 84)" //d.colour
        })
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          y: d => y(d.rank) + 5
        });
           
        bars
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          width: d => x(d.value) > x(0) + 1 ? x(d.value) - x(0) - 1 : 0,
          y: d => y(d.rank) + 5
        });
            			
        bars
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          width: d => x(d.value) > x(0) + 1 ? x(d.value) - x(0) - 1 : 0,
          y: d => y(top_n + 1) + 5
        })
        .remove();
            
        let labels = svg.selectAll('.label').data(yearSlice, d => d.name);

        labels
        .enter()
        .append('text')
        .attrs({
          class: 'label',
          x: d => x(d.value) - 8,
          y: d => y(top_n + 1) + 5 + ((y(1) - y(0)) / 2),
          'text-anchor': 'end'
        })
        .html('')
        // .html(d => d.name)
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1,
        });

        labels
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          x: d => x(d.value) - 8,
          y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1
        });

        labels
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          x: d => x(d.value) - 8,
          y: d => y(top_n + 1) + 5
        })
        .remove();

        let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

        valueLabels
        .enter()
        .append('text')
        .attrs({
          class: 'valueLabel',
          x: d => (x(d.value) > 530 && x(d.value)-105 > 0) ? x(d.value) - 105 : x(d.value) + 3,
          y: d => y(top_n + 1) + 5,
        })
        .text(d => d.name + ' (' +d3.format(',.0f')(d.lastValue)+ ')')
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1
        }).tween("text", function (d) {
          let i = d3.interpolateRound(d.lastValue, d.value);
          return function (t) {
            this.textContent = d3.format(',')(i(t));
          };
        });

        valueLabels
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          x: d => (x(d.value) > 530 && x(d.value)-105 > 0) ? x(d.value) - 105 : x(d.value) + 3,
          y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1
        })
        .tween("text", function (d) {
          let i = d3.interpolateRound(d.lastValue, d.value);
          return function (t) {
            this.textContent = d.name + ' (' +d3.format(',')(i(t))+ ')';
          };
        });

        valueLabels
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attrs({
          x: d => (x(d.value) > 530 && x(d.value)-105 > 0) ? x(d.value) - 105 : x(d.value) + 3,
          y: d => y(top_n + 1) + 5
        })
        .remove();

        bars.on("mouseover", function(d) {	
        let name = d3.select(this).attr("id");
        name = `${name.replace('_',' ')}`
        d3.selectAll(".bar").style("opacity", 0.5)
        d3.select(this).style("opacity", 1)
        div.transition()		
          .duration(200)		
          .style("opacity", .9);		
        div.html(name)	
          .style("left", (event.pageX - name.length) + "px")		
          .style("top", (event.pageY - (40+name.length)) + "px");
                
        }).on("mouseout", function(d) {	
          d3.selectAll(".bar").style("opacity", 1)
           div.transition()		
             .duration(500)		
             .style("opacity", 0);
        });

        yearText.html(getFormattedDate(datesByYear[year]));

        if (year == lastYear) ticker.stop();
        year = d3.format('.0f')((+year) + 1);
    }, tickDuration);
    
    // console.log('loaded');
    // window.dispatchEvent(new Event('resize'));
    // console.log('Resize Triggred');
    return svg.node();
}

function getFormattedDate(date) {
  return date ? months[date.getMonth()] + " " + (date.getDate() + 1) + " " + date.getFullYear() : ""
}

export default function RaceChart({graphData, startChart}){
    useEffect(()=> {

        console.log("race chart useEffect");

        graphData.map(function(values) {
          if(!firstYear) firstYear = values.year;
          lastYear = values.year;
          datesByYear[values.year] = new Date(values.date);
        });

        BarChartRace(graphData,startChart);

        console.log("start chart");
        console.log(startChart);

    });

    return(
        <>
        <div id="raceGraph"></div>
        </>
    )
}