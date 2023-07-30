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

const ScatterPlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  const groupedData: DataPoint[] = data.reduce((result: DataPoint[], current: DataPoint) => {
    const existingItem = result.find((item) => item[xKey] === current[xKey] && item[yKey] === current[yKey]);

    if (!existingItem) {
      result.push({
        ...current,
      });
    }

    return result;
  }, []);

  groupedData.sort((a, b) => {
    if (a[xKey] === b[xKey]) {
      return a[yKey] > b[yKey] ? 1 : -1;
    } else {
      return a[xKey] > b[xKey] ? 1 : -1;
    }
  });

  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const colorScale = d3.scaleSequential(d3.interpolateWarm).domain([0, groupedData.length]);

  useEffect(() => {
    if (data.length === 0) return;
    
    const screenWidth = window.innerWidth;
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const width = screenWidth < 700 ? screenWidth - margin.left - margin.right : 700 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    
    const svgWrapper = d3.select(svgRef.current);
    svgWrapper.selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, d3.max(groupedData, (d) => d[xKey] as number)!]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(groupedData, (d) => d[yKey] as number)!]).range([height, 0]);

    svg
      .selectAll('circle')
      .data(groupedData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d[xKey] as number))
      .attr('cy', (d) => yScale(d[yKey] as number))
      .attr('r', 5)
      .attr('fill', (_, i) => colorScale(i))
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.innerHTML = `${xKey}: ${d[xKey]}, ${yKey}: ${d[yKey]}`;
          tooltip.style.visibility = 'visible';
          tooltip.style.left = `${event.pageX + 10}px`;
          tooltip.style.top = `${event.pageY - 10}px`;
        }

        d3.select(event.currentTarget)
          .attr('r', 10);
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

        d3.select(event.currentTarget)
          .attr('r', 5);
      });

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);

    svg
      .append('text') 
      .attr('x', width / 2)
      .attr('y', height + margin.bottom / 2)
      .style('text-anchor', 'middle')
      .text("x-axis: "+ xKey);

    // Add y-axis label
    svg
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2)
      .attr('y', -margin.left / 2)
      .style('text-anchor', 'middle')
      .text("y-axis: "+ yKey);

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
          padding: '8px',
          borderRadius: '20px',
        }}
      ></div>
      <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', backgroundColor: 'transparent', padding: '8px' }}>
              {xKey}
            </th>
            <th style={{ border: '1px solid black', backgroundColor: 'transparent', padding: '8px' }}>
              {yKey}
            </th>
            <th style={{ border: '1px solid black', backgroundColor: 'transparent', padding: '8px' }}>
              Color
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((dataPoint, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{dataPoint[xKey].toString()}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{dataPoint[yKey].toString()}</td>
              <td
                style={{
                  border: '1px solid black',
                  padding: '8px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: colorScale(index),
                }}
              ></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ScatterPlot;
