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

const LinePlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  // Group the data based on the chosen xKey and yKey
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

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, d3.max(groupedData, (d) => d[xKey] as number)!]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(groupedData, (d) => d[yKey] as number)!]).range([height, 0]);

    const line = d3.line<DataPoint>()
      .x((d) => xScale(d[xKey] as number))
      .y((d) => yScale(d[yKey] as number));

    svg
      .append('path')
      .datum(groupedData)
      .attr('fill', 'none')
      .attr('stroke', colorScale(String(0))) // Set stroke color for the line
      .attr('stroke-width', 2) // Set stroke width for the line
      .attr('d', line);

    // Add circles for each data point
    svg
      .selectAll('circle')
      .data(groupedData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d[xKey] as number))
      .attr('cy', (d) => yScale(d[yKey] as number))
      .attr('r', 5)
      .attr('fill', (_, i) => colorScale(String(i)))
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.innerHTML = `${xKey}: ${String(d[xKey])}, ${yKey}: ${String(d[yKey])}`;
          tooltip.style.visibility = 'visible';
          tooltip.style.left = `${event.pageX + 10}px`;
          tooltip.style.top = `${event.pageY - 10}px`;
        }

        d3.select(event.currentTarget).attr('r', 8); // Increase the circle size on mouseover to highlight the point
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

        d3.select(event.currentTarget).attr('r', 5); // Revert the circle size on mouseout
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

export default LinePlot;
