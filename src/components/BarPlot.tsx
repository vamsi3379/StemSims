import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  [key: string]: number | string; // Make the DataPoint interface more generic
}

interface Props {
  data: DataPoint[];
  xKey: string; // Specify the key for the x-axis data (e.g., 'years')
  yKey: string; // Specify the key for the y-axis data (e.g., 'average')
}

const BarPlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  const groupedData: DataPoint[] = data.reduce((result: DataPoint[], current: DataPoint) => {
    const existingItem = result.find((item) => item[xKey] === current[xKey] && item[yKey] === current[yKey]);

    if (!existingItem) {
      // If the xKey and yKey combination does not exist, add it to the result array
      result.push({
        ...current,
      });
    }

    return result;
  }, []);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map((d) => d[xKey].toString())) // Use the xKey prop to access the x-axis data
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(groupedData, (d) => d[yKey] as number)!]) // Use the yKey prop to access the y-axis data
      .range([height, 0]);

    svg
      .selectAll('rect')
      .data(groupedData)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d[xKey].toString())!)
      .attr('y', (d) => yScale(d[yKey] as number))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d[yKey] as number))
      .attr('fill', 'steelblue')
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
      .on('mouseout', () => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.visibility = 'hidden';
        }
      });

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);
  }, [data, groupedData, xKey, yKey]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '4px',
          borderRadius: '4px',
        }}
      ></div>
    </>
  );
};

export default BarPlot;
