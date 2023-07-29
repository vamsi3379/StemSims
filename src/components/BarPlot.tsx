import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  [key: string]: number | string;
}

interface Props {
  data: DataPoint[];
  xKey: string;
  yKey: string;
}

const BarPlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  const groupedData: DataPoint[] = data.reduce((result: DataPoint[], current: DataPoint) => {
    const existingItem = result.find((item) => item[xKey] === current[xKey] && item[yKey] === current[yKey]);
  
    if (!existingItem) {
      result.push({
        ...current,
      });
    }
  
    return result;
  }, []);
  
  groupedData.sort((a, b) => (a[xKey] > b[xKey] ? 1 : -1));
  console.log(groupedData)

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const colorScale = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0, groupedData.length]);

  useEffect(() => {
    if (groupedData.length === 0) return;

    const screenWidth = window.innerWidth;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = screenWidth < 700 ? screenWidth - margin.left - margin.right : 700 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(groupedData.map((d) => d[xKey].toString()))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(groupedData, (d) => d[yKey] as number)!])
      .range([height, 0]);

    const bars = svg
      .selectAll<SVGRectElement, DataPoint>('rect')
      .data(groupedData, (d) => d[xKey].toString());

    bars.exit()
      .transition()
      .duration(1000)
      .attr('y', height)
      .attr('height', 0)
      .remove();

    bars.transition()
      .duration(500)
      .attr('x', (d) => xScale(d[xKey].toString())!)
      .attr('y', (d) => yScale(d[yKey] as number))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d[yKey] as number));

    bars.enter()
      .append('rect')
      .attr('x', (d) => xScale(d[xKey].toString())!)
      .attr('y', height)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', (_, i) => colorScale(i))
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.innerHTML = `${xKey}: ${d[xKey]}, ${yKey}: ${d[yKey]}`;
          tooltip.style.visibility = 'visible';
          tooltip.style.left = `${event.pageX + 10}px`;
          tooltip.style.top = `${event.pageY - 10}px`;
        }
      })
      .on('mousemove', (event) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.left = `${event.pageX + 10}px`;
          tooltip.style.top = `${event.pageY - 10}px`;
        }
      })
      .on('mouseout', (event, d) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.visibility = 'hidden';
        }
      })
      .transition()
      .duration(500)
      .attr('y', (d) => yScale(d[yKey] as number))
      .attr('height', (d) => height - yScale(d[yKey] as number));

    const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom / 2)
      .style('text-anchor', 'middle')
      .text("x-axis: " + xKey);

    svg
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2)
      .attr('y', -margin.left / 2)
      .style('text-anchor', 'middle')
      .text("y-axis: " + yKey);

  }, [data, groupedData, xKey, yKey, colorScale]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          padding: '4px',
          borderRadius: '4px',
        }}
      ></div>
    </>
  );
};

export default BarPlot;
