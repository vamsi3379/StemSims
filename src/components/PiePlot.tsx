import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';

interface DataPoint {
  [key: string]: number | string;
}

interface Props {
  data: DataPoint[];
  xKey: string;
  yKey: string;
}

const PiePlot: React.FC<Props> = ({ data, xKey, yKey }) => {
  const groupedData: DataPoint[] = data.reduce((result: DataPoint[], current: DataPoint) => {
    const existingItem = result.find((item) => item[xKey] === current[xKey] && item[yKey] === current[yKey]);

    if (!existingItem) {
      result.push({
        ...current,
      });
    }

    return result;
  }, []);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (groupedData.length === 0) return;

    const screenWidth = window.innerWidth;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = screenWidth < 600 ? screenWidth - margin.left - margin.right : 700 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateWarm)
      .domain([0, groupedData.length - 1]);

    const pie = d3
      .pie<DataPoint>()
      .value((d) => Number(d[yKey]))
      .sort(null);

    const arc = d3.arc<PieArcDatum<DataPoint>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const dataPie = pie(groupedData);

    const arcGroup = svg.selectAll('.arc')
      .data(dataPie)
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcGroup.append('path')
      .attr('d', (d) => arc(d)!)
      .attr('fill', (_, i) => colorScale(i))
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
      })
      .transition() 
      .duration(800)
      .attrTween('d', (d: any) => {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t: any) => arc(interpolate(t))!;
      });

    arcGroup.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text((d) => `${Math.floor((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)}%`)
      .style('font-size', '12px')
      .style('fill', '#fff')
      .style('opacity', 0)
      .transition()
      .delay(400)
      .duration(200)
      .style('opacity', 1);

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
      .attr('fill', (_, i) => colorScale(i)) 

    legend.append('text')
      .attr('x', 30)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .text((d) => d.data[xKey].toString())
      .style('font-size', '14px')
      .style('fill', '#000');

  }, [groupedData, xKey, yKey]);

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
