import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';

interface DataPoint {
  [key: string]: number | string; // Update the index signature to allow both number and string values
}

interface Props {
  data: DataPoint[];
  xKey: string;
  yKey: string;
}

const PiePlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3
      .pie<DataPoint>()
      .value((d) => Number(d[yKey]))
      .sort(null);

    const arc = d3.arc<PieArcDatum<DataPoint>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const dataPie = pie(data);

    const arcGroup = svg.selectAll('.arc')
      .data(dataPie)
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcGroup.append('path')
      .attr('d', (d) => arc(d)!)
      .attr('fill', (_, i) => colorScale(String(i)))
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.innerHTML = `${xKey}: ${d.data[xKey]}, ${yKey}: ${d.data[yKey]}`;
          tooltip.style.visibility = 'visible';
          tooltip.style.left = `${event.clientX + 10}px`;
          tooltip.style.top = `${event.clientY - 10}px`;
        }
      })
      .on('mousemove', (event) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.left = `${event.clientX + 10}px`;
          tooltip.style.top = `${event.clientY - 10}px`;
        }
      })
      .on('mouseout', () => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.visibility = 'hidden';
        }
      });

    // Add text element with percentage value within each arc
    arcGroup.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text((d) => `${Math.floor((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)}%`) // Round down to integer
      .style('font-size', '12px')
      .style('fill', '#fff');

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 20)`)
      .selectAll('.legend')
      .data(dataPie)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`);

    legend.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', (_, i) => colorScale(String(i)));

    legend.append('text')
      .attr('x', 30)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .text((d) => d.data[xKey].toString())
      .style('font-size', '14px')
      .style('fill', '#000');
  }, [data, xKey, yKey]);

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
          padding: '8px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      ></div>
    </>
  );
};

export default PiePlot;
