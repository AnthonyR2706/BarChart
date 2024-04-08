import { React, useEffect, useState }from 'react'
import * as d3 from "d3";

const BarGraph = () => {

    const [gdpData, setGdpData] = useState()

    const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    let displayData

    async function getJson() {
        const response = await fetch(url)
        const responseData = await response.json()
        displayChart(responseData)
    }

    function displayChart(responseData){
        displayData = responseData.data.map(data => data)
        let displayDate = responseData.data.map(data => Date.parse(data[0]))
        console.log(displayData)
        console.log(displayDate)
        setGdpData(displayData)
        const w = window.screen.width;
        const h = 750;
        const padding = 100;
        const barWidth = (w - padding) / displayData.length
        const xScale = d3.scaleTime()
            .domain(d3.extent(displayDate))
            .range([0, w - padding]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(displayData, (d) => d[1])])
            .range([h - padding, 0]);
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        var tooltip = d3.select("#barChart")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "0px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("box-shadow", "2px 2px 20px")
            .style("opacity", "0.9")
            .attr("id", "tooltip");

        const svg = d3.select("svg")
            .attr("width", w)
            .attr("height", h);
        svg.selectAll("rect")
            .data(displayData)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * (barWidth) + padding / 2)
            .attr("y", (d, i) => h - d[1]/30 - padding / 2)
            .attr("width", barWidth)
            .attr("height", (d, i) => d[1]/30)
            .attr("fill", "lightblue")
            .on("mouseover", handleMouseOver)
            .on("mousemove", handleMouseMove)
            .on("mouseout", handleMouseOut)
            
            function handleMouseOver (event, d) {
                d3.select(this).attr("fill", "orange");
                tooltip.style("visibility", "visible");
           };
           
           function handleMouseMove (event, d) {
               tooltip
                 .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px")
                 .html("<center>" + d[0].replace(/-01-01/, ' Q1').replace(/-04-01/, ' Q2').replace(/-07-01/, ' Q3').replace(/-10-01/, ' Q4') + "<br>" + "$" + d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " Billion </center>");
           };
         
           function handleMouseOut (event, d) {
                d3.select(this).attr("fill", "lightblue");
                tooltip.style("visibility", "hidden");
           };

        svg.append("g")
            .attr("transform", "translate(" + (padding / 2) + "," + (h - padding / 2) + ")")
            .call(xAxis);
        svg.append("g")
            .attr("transform", "translate(" + (padding / 2) + ", "+ (padding / 2) +")")
            .call(yAxis)

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("y", padding)
            .attr("x", 0 - (h / 3))
            .attr("transform", "rotate(-90)")
            .text("Gross Domestic Product");

    }

    useEffect(() => {
        getJson()
    }, [])

    return (
        <div className='barContainer' id = 'barChart'>
            <svg/>
        </div>
    )
}

export default BarGraph
