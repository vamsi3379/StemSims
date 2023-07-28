import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';

interface DataPoint {
  [key: string]: number; // Make the DataPoint interface more generic
}

interface Props {
  data: DataPoint[];
  xKey: string; // Specify the key for the years data (e.g., 'years')
  yKey: string; // Specify the key for the average data (e.g., 'average')
}

const PiePlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  const groupedData: DataPoint[] = data.reduce((result: DataPoint[], current: DataPoint) => {
    const existingItem = result.find((item) => item[xKey] === current[xKey]);

    if (!existingItem) {
      // If the xKey does not exist, add it to the result array
      result.push({
        ...current,
      });
    }

    return result;
  }, []);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3
      .pie<DataPoint>()
      .value((d) => d[yKey]) // Use the yKey prop to access the average data
      .sort(null);

    const arc = d3.arc<PieArcDatum<DataPoint>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const dataPie = pie(groupedData); // Use groupedData to create the pie chart

    const arcGroup = svg.selectAll('.arc')
      .data(dataPie)
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcGroup.append('path')
      .attr('d', (d) => arc(d)!)
      .attr('fill', (_, i) => colorScale(String(i))); // Convert index (i) to string

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right}, 0)`)
      .selectAll('.legend')
      .data(dataPie)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (_, i) => `translate(0, ${i * 20})`);

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (_, i) => colorScale(String(i)));

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text((d) => d.data[xKey].toString()); // Use xKey prop to access the years data
  }, [data, groupedData, xKey, yKey]);

  return <svg ref={svgRef}></svg>;
};

export default PiePlot;